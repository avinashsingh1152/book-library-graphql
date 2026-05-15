import { gql } from '@apollo/client';

export const CREATE_BOOK = gql`
  mutation CreateBook($title: String!, $description: String, $published_date: String, $cover_image: String, $author_id: ID) {
    createBook(title: $title, description: $description, published_date: $published_date, cover_image: $cover_image, author_id: $author_id) {
      id
      title
      description
      published_date
      cover_image
      author {
        id
        name
      }
    }
  }
`;

export const UPDATE_BOOK = gql`
  mutation UpdateBook($id: ID!, $title: String, $description: String, $published_date: String, $cover_image: String, $author_id: ID) {
    updateBook(id: $id, title: $title, description: $description, published_date: $published_date, cover_image: $cover_image, author_id: $author_id) {
      id
      title
      description
      published_date
      cover_image
      author {
        id
        name
      }
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`;
