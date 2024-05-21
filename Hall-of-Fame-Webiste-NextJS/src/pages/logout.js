import useTranslation from "@/hooks/useTranslation";
import { resetState } from "@/redux/reducers/auth";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

function logout() {
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    dispatch(resetState());
    router.push("/");
  }, [dispatch]);

  return <div></div>;
}

export default logout;
