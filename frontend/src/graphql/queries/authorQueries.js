import { gql } from '@apollo/client';

export const GET_AUTHORS = gql`
  query GetAuthors(
    $page: Int
    $pageSize: Int
    $name: String
    $birth_year: Int
    $sortBy: String
    $sortOrder: String
  ) {
    authors(
      page: $page
      pageSize: $pageSize
      name: $name
      birth_year: $birth_year
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      authors {
        id
        name
        biography
        born_date
        photo
        created_by
      }
      total
      page
      pageSize
      totalPages
    }
  }
`;

export const GET_AUTHOR = gql`
  query GetAuthor($id: ID!) {
    author(id: $id) {
      id
      name
      biography
      born_date
      photo
      created_by
      books {
        id
        title
        published_date
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_AUTHORS_LIST = gql`
  query GetAuthorsList($created_by: String) {
    authors(pageSize: 100, created_by: $created_by) {
      authors {
        id
        name
      }
    }
  }
`;
