"use client";

import { useTRPC } from "@/lib/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

function RegisterReferral() {
  const trpc = useTRPC();

  const { mutate: redeemReferralCode } = useMutation(
    trpc.waitlist.redeemReferralCode.mutationOptions({
      onSuccess: (data) => {
        console.log("Successfully redeemed referral code", data);
      },
    })
  );

  useEffect(() => {
    const from = localStorage.getItem("from");

    if (from) {
      redeemReferralCode({ referralCode: from });
    }
  }, []);

  return <></>;
}

export default RegisterReferral;
