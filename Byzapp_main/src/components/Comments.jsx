import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Comment = ({user, isLoggedIn, logout}) => {
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [replyInput, setReplyInput] = useState('');
    

  const fetchComments = async () => {
    try {
        const response = await axios.get('https://apiresttc2005b-production.up.railway.app/comments');
        setComments(response.data);
    } catch (error) {
        console.error(error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleReplySubmit = async (event, parentId, comment, reply) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://apiresttc2005b-production.up.railway.app/comments/replies', {
        idcomment: comment.idcomment,
        iduser: user.iduser,
        idreply_parent: reply.idreply, 
        reply: replyInput,
      });
      const newReply = {
        idreply: response.data.idreply,
        iduser: response.data.iduser,
        reply: response.data.reply,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        reply_username: user.username,
      };
      setComments((prevState) =>
        prevState.map((comment) =>
          comment.idcomment === parentId
            ? { ...comment, replies: [...comment.replies, newReply] }
            : comment
        )
      );
      setReplyInput('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    try {
        const response = await axios.post('https://apiresttc2005b-production.up.railway.app/comments', {
        iduser: user.iduser, // replace with actual id of logged in user
        comment: commentInput,
      });
        const newComment = {
        idcomment: response.data.idcomment,
        iduser: response.data.iduser,
        comment: response.data.comment,
        created_at: new Date().toISOString(), // use server-side timestamp instead
        updated_at: new Date().toISOString(), // use server-side timestamp instead
        comment_username: user.username, // replace with actual username of logged in user
        replies: [],
      };
        setComments((prevState) => [...prevState, newComment]);
        setCommentInput('');
    } catch (error) {
        console.error(error);
    }
  };


  return (
    <div>
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          placeholder="Leave a comment..."
          value={commentInput}
          onChange={(event) => setCommentInput(event.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {comments.map((comment) => (
          <li key={comment.idcomment}>
            <p>{comment.comment}</p>
            <p>{comment.comment_username}</p>
            <h1> {comment.idcomment} </h1>
            <input
                type="text"
                placeholder="Leave a comment..."
                value={replyInput}
                onChange={(event) => setReplyInput(event.target.value)}
                />
            <button onClick={(event) => handleReplySubmit(event, comment.idcomment )}>Reply</button>
            <ul>
              {comment.replies.map((reply) => (
                <li key={reply.idreply}>
                  <p>{reply.reply}</p>
                  <p>{reply.reply_username}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comment;
