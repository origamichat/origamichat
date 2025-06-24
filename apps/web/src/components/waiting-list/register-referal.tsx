"use client";

import { trpc } from "@/lib/trpc";
import { useEffect } from "react";

function RegisterReferral() {
  const { mutate: redeemReferralCode } =
    trpc.waitlist.redeemReferralCode.useMutation();

  useEffect(() => {
    const from = localStorage.getItem("from");

    if (from) {
      redeemReferralCode({ referralCode: from });
    }
  }, []);

  return <></>;
}

export default RegisterReferral;
