import { gql } from '@apollo/client';

export const CREATE_AUTHOR = gql`
  mutation CreateAuthor($name: String!, $biography: String, $born_date: String, $photo: String) {
    createAuthor(name: $name, biography: $biography, born_date: $born_date, photo: $photo) {
      id
      name
      biography
      born_date
      photo
    }
  }
`;

export const UPDATE_AUTHOR = gql`
  mutation UpdateAuthor($id: ID!, $name: String, $biography: String, $born_date: String, $photo: String) {
    updateAuthor(id: $id, name: $name, biography: $biography, born_date: $born_date, photo: $photo) {
      id
      name
      biography
      born_date
      photo
    }
  }
`;

export const DELETE_AUTHOR = gql`
  mutation DeleteAuthor($id: ID!) {
    deleteAuthor(id: $id)
  }
`;
