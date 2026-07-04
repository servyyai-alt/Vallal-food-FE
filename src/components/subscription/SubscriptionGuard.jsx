import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import webbyLogo from "./webby.png";
import SubscriptionExpired from "./SubscriptionExpired";
import { getSubscriptionStatus } from "../../services/subscriptionApi";
import {
  getSubscriptionConfig,
  isSubscriptionAllowed,
  isSubscriptionBlocked,
} from "../../utils/subscription";
import "./SubscriptionExpired.css";

const StatusShell = ({ children }) => (
  <div className="subscription-expired-root">
    <div className="bg-blueprint" />
    <div className="subscription-top-logo">
      <img
        src={webbyLogo}
        alt="Webby Logo"
        className="subscription-logo-img"
      />
    </div>
    <div className="subscription-content">{children}</div>
  </div>
);

const LoadingScreen = () => (
  <StatusShell>
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="flex flex-col items-center w-full"
    >
      <div className="mx-auto mb-10 h-14 w-14 animate-spin rounded-full border-4 border-[#3B82F6]/20 border-t-[#3B82F6] shadow-[0_0_20px_rgba(59,130,246,0.15)]" />

      <h1 className="subscription-heading">
        Authenticating System
      </h1>

      <p className="subscription-description">
        Verifying your Vallal Food Products
        subscription and establishing secure connection with Webby servers.
      </p>
    </motion.div>
  </StatusShell>
);

const ErrorScreen = ({ onRetry, message }) => (
  <StatusShell>
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="flex flex-col items-center w-full"
    >
      <div className="connection-lost-badge mb-8">
        <span className="badge-dot" />
        <span className="badge-text">Connection Error</span>
      </div>

      <h1 className="subscription-heading">
        Connection Failed
      </h1>

      <p className="subscription-description">
        Unable to verify subscription status with the licensing server.
      </p>

      {message ? (
        <div className="mb-8 rounded-xl border border-red-500/20 bg-[#FFF5F5] px-6 py-4 shadow-sm max-w-lg w-full text-center">
          <p className="text-[15px] font-medium leading-relaxed text-[#EF4444]">
            {message === "Subscription or EMI contract not found" ? "Subscription contract not found" : message}
          </p>
        </div>
      ) : null}

      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] px-8 py-3.5 text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(59,130,246,0.25)] hover:bg-[#2563EB] hover:shadow-[0_6px_20px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
      >
        <RefreshCw size={18} />
        Retry Connection
      </button>
    </motion.div>
  </StatusShell>
);

const SubscriptionGuard = ({ children }) => {
  const { error: configError } = getSubscriptionConfig();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestError, setRequestError] = useState(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);

      const response = await getSubscriptionStatus();

      setData(response);
      setRequestError(null);
    } catch (err) {
      setRequestError(
        err?.response?.data?.message ||
          err?.message ||
          "Subscription validation failed."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    const interval = setInterval(() => {
      fetchStatus();
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (configError || requestError || !data?.subscriptionStatus) {
    return (
      <ErrorScreen
        onRetry={fetchStatus}
        message={configError || requestError}
      />
    );
  }

  if (isSubscriptionBlocked(data.subscriptionStatus)) {
    return (
      <SubscriptionExpired status={data.subscriptionStatus} />
    );
  }

  if (!isSubscriptionAllowed(data.subscriptionStatus)) {
    return (
      <ErrorScreen
        onRetry={fetchStatus}
        message={`Unsupported subscription status: ${data.subscriptionStatus}`}
      />
    );
  }

  return children;
};

export default SubscriptionGuard;