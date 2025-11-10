import { useQuery } from "@tanstack/react-query";
import { UserAPI } from "./userAPI";
import type { GetUserRequest } from "@/types";

const userQueryKey = {
  users: "users",
};

export const useGetUsers = (filterParams: GetUserRequest) => {
  return useQuery({
    queryKey: [userQueryKey.users, filterParams],
    queryFn: () => UserAPI.getUsers(filterParams).then((res) => res.data),
  });
};
