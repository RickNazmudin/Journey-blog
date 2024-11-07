"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import styled from "styled-components";

// Definisi tipe data untuk postingan
interface Post {
  id: number;
  title: string;
  content: string;
}

// Styled components untuk tata letak halaman
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  font-family: "Roboto", sans-serif;
`;

const Header = styled.h1`
  text-align: center;
  color: #2c3e50;
  font-size: clamp(2rem, 4vw, 2.5rem);
  margin-bottom: 20px;
  font-weight: 700;
`;

const Subheader = styled.p`
  text-align: center;
  color: #34495e;
  font-size: clamp(1rem, 2vw, 1.2rem);
  margin-bottom: 30px;
  font-weight: 300;
`;

const PostsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  padding: 20px 0;
`;

const PostCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  }
`;

const PostTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 1.4rem;
  font-weight: 500;
`;

const PostContent = styled.p`
  color: #34495e;
  line-height: 1.6;
  font-size: 1rem;
`;

// Komponen halaman utama
const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Fetch sesi pengguna dari next-auth
    const fetchSession = async () => {
      const sessionData = await getSession();
      if (sessionData) {
        // Gunakan sessionData jika diperlukan
        console.log(sessionData); // Contoh penggunaan
      }
    };

    // Fetch postingan dari API
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error("Gagal mengambil postingan");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSession();
    fetchPosts();
  }, []);

  return (
    <PageContainer>
      <Header>Perjalanan Spiritual Anda</Header>
      <Subheader>
        Temukan kedamaian dan pencerahan melalui berbagi pengalaman spiritual
      </Subheader>
      <PostsContainer>
        {posts.map((post) => (
          <PostCard key={post.id}>
            <PostTitle>{post.title}</PostTitle>
            <PostContent>{post.content}</PostContent>
          </PostCard>
        ))}
      </PostsContainer>
    </PageContainer>
  );
};

export default HomePage;
