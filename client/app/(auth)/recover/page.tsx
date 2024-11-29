import React from "react";
import RecoverForm from "./form";

const RecoverPage = async ({
  searchParams,
}: {
  searchParams: { email?: string | string[] | undefined };
}) => {
  const email = typeof searchParams.email == "string" ? searchParams.email : "";
  return <RecoverForm email={email} />;
};

export default RecoverPage;
