import Link from "next/link";
import fs from "fs";
import matter from "gray-matter";
import styled from "styled-components";
import UnstyledLink from "../components/styled/UnstyledLink";
import useCart from "../hooks/useCart";


// from:🎄Day 1 - Introduction to Build an E-Commerce Platform in 25 Days with Next.js, Netlify and Stripe
//   https://www.youtube.com/watch?v=LbrcQ0J2TVE
// https://github.com/realityexpander/e-commerce-in-25-days/tree/master/19-style-and-animate-cart/next-app
// Netlify: https://app.netlify.com/sites/realityexpander-store/

// to run full netlify locally: netlify dev  
// to run locally: npm run dev
// Must add STRIPE ENVIRONMENT_KEYS: (NEXT_PUBLIC_* makes env var usable on netlify platform )
//  NEXT_PUBLIC_STRIPE_PUBLIC_KEY
//  STRIPE_SECRET_KEY


const Container = styled.div`
  background: white;
  padding: 1rem 2rem;
  min-height: 200px;
  position: relative;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.02);
  }
`;

const ProductsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0.5rem;
  margin: 0.5rem 0;
`;

const Price = styled.div`
  position: absolute;
  bottom: 0.5rem;
  right: 1rem;
  font-size: 2.5rem;
`;

const renderProduct = (product, addItemToCart) => {
  const handleClick = (e) => {
    e.stopPropagation();
    addItemToCart(product);
  };

  return (
    <Link key={product.id} href={product.slug}>
      <UnstyledLink>
        <Container>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <button onClick={handleClick}>Add to cart</button>
          <Price>${product.price / 100}</Price>
        </Container>
      </UnstyledLink>
    </Link>
  );
};

const HomePage = (props) => {
  const { cart, addItemToCart } = useCart();
  console.log(cart);
  return (
    <ProductsContainer>
      {props.products.map((product) => renderProduct(product, addItemToCart))}
    </ProductsContainer>
  );
};

export const getStaticProps = async () => {
  const directory = `${process.cwd()}/content`;
  const filenames = fs.readdirSync(directory);

  const products = filenames.map((filename) => {
    // read the file from fs
    const fileContent = fs.readFileSync(`${directory}/${filename}`).toString();
    // pull out frontmatter => name
    const { data } = matter(fileContent);
    // return name, slug
    const slug = `/products/${filename.replace(".md", "")}`;
    const product = {
      ...data,
      slug,
    };
    return product;
  });

  return {
    props: {
      products,
    },
  };
};

export default HomePage;
