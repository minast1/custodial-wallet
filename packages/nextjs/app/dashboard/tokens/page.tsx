import { NextPage } from "next";

const TokensPage: NextPage = () => {
  return (
    <>
      <div className="text-center mt-8 bg-secondary p-10">
        <h1 className="text-4xl my-0">Tokens</h1>
        <p className="text-neutral">
          You can see your tokens here.
          <br /> Check{" "}
          <code className="italic bg-base-300 text-base font-bold [word-spacing:-0.5rem] px-1">
            packages / nextjs / app / dashboard / tokens / page.tsx
          </code>{" "}
        </p>
      </div>
    </>
  );
};

export default TokensPage;
