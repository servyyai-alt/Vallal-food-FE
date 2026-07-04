import axios from "axios";
import {
  getSubscriptionConfig,
  normalizeSubscriptionStatus,
} from "../utils/subscription";

export const getSubscriptionStatus = async () => {
  const { webbyApiUrl, subscriptionId, error } = getSubscriptionConfig();

  if (error) {
    throw new Error(error);
  }

  const { data } = await axios.get(
    `${webbyApiUrl}/api/sites/${subscriptionId}/status`
  );

  return {
    ...data,
    subscriptionStatus: normalizeSubscriptionStatus(
      data.subscriptionStatus
    ),
  };
};