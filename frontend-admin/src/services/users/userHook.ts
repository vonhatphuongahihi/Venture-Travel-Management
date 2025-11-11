import type { GetUserRequest } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserAPI } from "./userAPI";

const userQueryKey = {
  users: "users",
  usersStatistics: "userStatistics",
};

export const useGetUsers = (filterParams: GetUserRequest) => {
  return useQuery({
    queryKey: [userQueryKey.users, filterParams],
    queryFn: () => UserAPI.getUsers(filterParams).then((res) => res.data),
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      UserAPI.toggleUserStatus(userId, isActive),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [userQueryKey.users] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => UserAPI.deleteUser(userId),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [userQueryKey.users] });
    },
  });
};

export const useGetUsersStatistics = () => {
  return useQuery({
    queryKey: [userQueryKey.usersStatistics],
    queryFn: () => UserAPI.getUsersStatistics().then((res) => res.data),
  });
};
