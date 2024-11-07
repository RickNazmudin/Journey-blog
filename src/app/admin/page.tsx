"use client";

import { useEffect, useState } from "react";
import { getSession, signOut } from "next-auth/react";
import styled, { keyframes } from "styled-components";

interface Post {
  id: number;
  title: string;
  content: string;
}

interface User {
  email: string | null;
}

interface Session {
  user: User;
}

// Styled Components
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AdminContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  animation: ${fadeIn} 0.5s ease-out;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.h1`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 2rem;
`;

const WelcomeMessage = styled.p`
  text-align: center;
  color: #34495e;
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  backdrop-filter: blur(4px);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #bdc3c7;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2c3e50;
  }
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #bdc3c7;
  font-size: 1rem;
  min-height: 150px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2c3e50;
  }
`;

const Button = styled.button`
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #98afc7;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #fd1c03;

  &:hover {
    background-color: #c0392b;
  }
`;

const EditButton = styled(Button)`
  background-color: #2554c7;

  &:hover {
    background-color: #1f45fc;
  }
`;

const LogoutButton = styled(Button)`
  background-color: #fd1c03;
  margin-top: 2rem;

  &:hover {
    background-color: #c0392b;
  }
`;

const PostsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const PostCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(31, 38, 135, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const PostTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const PostContent = styled.p`
  color: #34495e;
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const LoadingText = styled.p`
  text-align: center;
  color: #34495e;
  font-size: 1.2rem;
  margin: 2rem 0;
`;

const Notification = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 1rem;
  background: #2554c7;
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.3s ease-out;
`;

const AdminPage = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostTitle, setNewPostTitle] = useState<string>("");
  const [newPostContent, setNewPostContent] = useState<string>("");
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<string>("");

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      setSession(sessionData);
      if (!sessionData) {
        window.location.href = "/login";
      } else {
        fetchPosts();
      }
    };

    fetchSession();
  }, []);

  const fetchPosts = async () => {
    const response = await fetch("/api/posts");
    if (response.ok) {
      const data = await response.json();
      setPosts(data);
    }
    setLoading(false);
  };

  const handleAddOrUpdatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const endpoint = "/api/posts";
    const method = editingPostId ? "PUT" : "POST";
    const body = editingPostId
      ? { id: editingPostId, title: newPostTitle, content: newPostContent }
      : { title: newPostTitle, content: newPostContent };

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data = await response.json();
      if (editingPostId) {
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === data.id ? data : post))
        );
        showNotification("Teaching updated successfully!");
      } else {
        setPosts((prevPosts) => [...prevPosts, data]);
        showNotification("New teaching shared successfully!");
      }
      resetForm();
    } else {
      showNotification("Something went wrong. Please try again.");
    }
  };

  const handleEditPost = (post: Post) => {
    setEditingPostId(post.id);
    setNewPostTitle(post.title);
    setNewPostContent(post.content);
  };

  const handleDeletePost = async (id: number) => {
    const response = await fetch("/api/posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
      showNotification("Teaching deleted successfully!");
    }
  };

  const resetForm = () => {
    setNewPostTitle("");
    setNewPostContent("");
    setEditingPostId(null);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    window.location.href = "/";
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  if (loading)
    return <LoadingText>Loading your spiritual content...</LoadingText>;

  return (
    <AdminContainer>
      <Header>Spiritual Admin Dashboard</Header>
      {session && (
        <WelcomeMessage>
          Welcome back, enlightened one: {session.user.email}
        </WelcomeMessage>
      )}

      <FormCard>
        <Form onSubmit={handleAddOrUpdatePost}>
          <Input
            type="text"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            placeholder="Enter your enlightening title..."
            required
          />
          <TextArea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Share your spiritual wisdom here..."
            required
          />
          <Button type="submit">
            {editingPostId ? "Update Teaching" : "Share New Teaching"}
          </Button>
        </Form>
      </FormCard>

      <Header as="h2">Your Spiritual Teachings</Header>
      <PostsList>
        {posts.map((post) => (
          <PostCard key={post.id}>
            <PostTitle>{post.title}</PostTitle>
            <PostContent>{post.content}</PostContent>
            <ButtonGroup>
              <EditButton onClick={() => handleEditPost(post)}>
                <i className="fas fa-edit"></i> Edit
              </EditButton>
              <DeleteButton onClick={() => handleDeletePost(post.id)}>
                <i className="fas fa-trash-alt"></i> Delete
              </DeleteButton>
            </ButtonGroup>
          </PostCard>
        ))}
      </PostsList>

      <LogoutButton onClick={handleLogout}>
        <i className="fas fa-sign-out-alt"></i> Leave Sanctuary
      </LogoutButton>

      {notification && <Notification>{notification}</Notification>}
    </AdminContainer>
  );
};

export default AdminPage;
