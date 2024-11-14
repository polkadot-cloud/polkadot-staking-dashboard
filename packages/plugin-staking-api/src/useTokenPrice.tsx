import { gql, useQuery } from '@apollo/client';

const TOKEN_PRICE_QUERY = gql`
  query TokenPrice($ticker: String!) {
    tokenPrice(ticker: $ticker) {
      price
      change
    }
  }
`;

export const useTokenPrice = ({ ticker }: { ticker: string }) => {
  const { loading, error, data } = useQuery(TOKEN_PRICE_QUERY, {
    variables: { ticker },
  });
  return { loading, error, data };
};
