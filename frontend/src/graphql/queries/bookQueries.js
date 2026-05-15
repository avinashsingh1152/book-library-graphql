import { gql } from '@apollo/client';

export const GET_BOOKS = gql`
  query GetBooks(
    $page: Int
    $pageSize: Int
    $title: String
    $author_id: ID
    $published_date_from: String
    $published_date_to: String
    $sortBy: String
    $sortOrder: String
  ) {
    books(
      page: $page
      pageSize: $pageSize
      title: $title
      author_id: $author_id
      published_date_from: $published_date_from
      published_date_to: $published_date_to
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      books {
        id
        title
        description
        published_date
        cover_image
        created_by
        author {
          id
          name
        }
      }
      total
      page
      pageSize
      totalPages
    }
  }
`;

export const GET_BOOK = gql`
  query GetBook($id: ID!) {
    book(id: $id) {
      id
      title
      description
      published_date
      cover_image
      created_by
      author_id
      author {
        id
        name
        biography
      }
      createdAt
      updatedAt
    }
  }
`;
