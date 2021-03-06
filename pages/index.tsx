/* eslint-disable jsx-a11y/anchor-is-valid */
import { NextPageContext } from 'next';

const Home: React.FC = () => null;

export const getServerSideProps = ({ res }: NextPageContext): any => {
  if (res) {
    res.writeHead(302, {
      Location: '/portfolio',
    });
    res.end();
  }

  return {};
};

export default Home;
