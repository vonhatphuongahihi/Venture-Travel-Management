import { axiosClient } from "@/configs/axiosClient";
import type {
  AbstractResponse,
  GetUserRequest,
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
}
