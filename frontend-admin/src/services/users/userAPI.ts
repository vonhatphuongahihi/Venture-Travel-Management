import { axiosClient } from "@/configs/axiosClient";
import type {
  AbstractResponse,
  GetUserRequest,
  GetUserStatisticsResponse,
  PaginatedResponse,
  User,
} from "@/types";

export class UserAPI {
  static prefix = "/users";

  static async getUsers(
    filterParams: GetUserRequest
  ): Promise<AbstractResponse<PaginatedResponse<User>>> {
    const { data } = await axiosClient.get(`${UserAPI.prefix}`, {
      params: filterParams,
    });

    return data;
  }

  static async toggleUserStatus(
    userId: string,
    isActive: boolean
  ): Promise<AbstractResponse<User>> {
    const { data } = await axiosClient.patch(
      `${UserAPI.prefix}/${userId}/status`,
      { is_active: isActive }
    );

    return data;
  }

  static async deleteUser(userId: string): Promise<AbstractResponse<null>> {
    const { data } = await axiosClient.delete(`${UserAPI.prefix}/${userId}`);

    return data;
  }

  static async getUsersStatistics(): Promise<
    AbstractResponse<GetUserStatisticsResponse>
  > {
    const { data } = await axiosClient.get(`${UserAPI.prefix}/statistics`);

    return data;
  }
}
