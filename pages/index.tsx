import { FC, FormEventHandler, useState } from 'react';
import { GetServerSideProps } from 'next';
import {
  Block,
  Link,
  DataTable,
  DataTableRow,
  Input,
  Steth,
  Button,
} from '@lidofinance/lido-ui';
import Head from 'next/head';
import Wallet from 'components/wallet';
import Section from 'components/section';
import Layout from 'components/layout';
import Faq from 'components/faq';
import { FAQItem, getFaqList } from 'lib/faqList';
import styled from 'styled-components';
import {
  useContractSWR,
  useSTETHContractRPC,
  useSTETHContractWeb3,
} from '@lido-sdk/react';

const contract = require('../contractAbi2.json');
import { createAlchemyWeb3 } from '@alch/alchemy-web3';

interface HomeProps {
  faqList: FAQItem[];
}

const InputWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spaceMap.md}px;
`;
const API_URL =
  'https://eth-mainnet.g.alchemy.com/v2/EIXoDo9vR8izGHBd-PohuN-uaYO1jAb6';

// const testAbi = contract.abi;
const web3 = createAlchemyWeb3(API_URL);
const contractAddress = '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84';
const refD = new web3.eth.Contract(contract.abi, contractAddress);
const Home: FC<HomeProps> = ({ faqList }) => {
  const [inputValue, setInputValue] = useState('0');
  const handleSubmit: FormEventHandler<HTMLFormElement> | undefined = (e) => {
    e.preventDefault();
    // alert('Submitted');
    contractWeb3?.submit(refD.toString(), {
      from: inputValue,
    });

    // contractWeb3.transfer(to, value);
  };

  const contractRpc = useSTETHContractRPC();
  const contractWeb3 = useSTETHContractWeb3();
  const tokenName = useContractSWR({
    contract: contractRpc,
    method: 'name',
  });

  return (
    <Layout
      title="Lido Frontend Template"
      subtitle="Develop Lido Apps without hassle"
    >
      <Head>
        <title>Lido | Frontend Template</title>
      </Head>
      <Wallet />
      <Block>
        <form action="" method="post" onSubmit={handleSubmit}>
          <InputWrapper>
            <Input
              fullwidth
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              value={inputValue}
              placeholder="0"
              leftDecorator={<Steth />}
              label="Token amount"
            />
          </InputWrapper>
          <Button fullwidth type="submit">
            Submit
          </Button>
        </form>
      </Block>
      <Section title="Data table" headerDecorator={<Link href="#">Link</Link>}>
        <Block>
          <DataTable>
            <DataTableRow title="Token name" loading={tokenName.initialLoading}>
              {tokenName.data}
            </DataTableRow>
          </DataTable>
        </Block>
      </Section>
      <Faq faqList={faqList} />
    </Layout>
  );
};

export default Home;

const faqList = getFaqList(['lido-frontend-template']);

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  return { props: { faqList: await faqList } };
};
