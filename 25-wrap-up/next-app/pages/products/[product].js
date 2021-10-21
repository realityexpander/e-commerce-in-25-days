import fs from "fs";
import matter from "gray-matter";
import marked from "marked";
import styled from "styled-components";
import Page from "../../components/styled/Page";

const Title = styled.div`
  display: flex;
  align-items: flex-end;
`;

const SubTitle = styled.p`
  padding: 0.75rem 0.5rem;
  color: #666;
`;

const Circle = styled.div`
  width: 30px;
  height: 30px;
  border: 10px;
  border-style: solid dotted dotted solid;
  border-radius: 50%;
  border-color: red;
  animation: anim 2s ease-in-out infinite;

  @keyframes anim {
    0% {
      transform: rotate(250deg);
    }
    50% {
      transform: rotate(180deg);
    }
    100% {
      transform: rotate(250deg);
    }
  }
`;


const Price = styled.span`
  font-size: 2rem;
  background: #05d7df;
  padding: 0.25rem 1rem;
  border-radius: 5px;
  color: white;
  font-weight: 800;
  margin-bottom: 1rem;
  display: inline-block;
`;

const Product = ({ product: { data, content } }) => {
  const html = marked(content); // Convert markdown to html
  return (
    <Page>
      <Circle />
      <Title>
        <h1>{data.name}</h1>
        <SubTitle>{data.description}</SubTitle>
      </Title>
      <Price>${data.price / 100}</Price>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Page>
  );
};

export const getStaticPaths = () => {
  // product pages to generate
  const directory = `${process.cwd()}/content`;
  const filenames = fs.readdirSync(directory);

  const paths = filenames.map((filename) => {
    return {
      params: {
        product: filename.replace(".md", ""),
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const productName = context.params.product;
  const filepath = `${process.cwd()}/content/${productName}.md`;
  const fileContent = fs.readFileSync(filepath).toString();
  const { data, content } = matter(fileContent); // get vars and content from markdown file

  return {
    props: {
      product: {
        data,
        content,
      },
    },
  };
};

export default Product;
