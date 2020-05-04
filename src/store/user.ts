import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { RootState } from ".";

export interface UserState {
  userId: string;
  email: string;
}

@Module({ name: "user" })
export class UserStore extends VuexModule<UserState, RootState> {
  userId: string | null = null;
  email: string | null = null;

  @Mutation
  setUserId(userId: string | null) {
    this.userId = userId;
  }

  @Mutation
  setEmail(email: string | null) {
    this.email = email;
  }

  @Action
  logout() {
    this.setUserId(null);
    this.setEmail(null);
  }

  get isLoggedIn(): boolean {
    return this.userId ? this.userId.length > 0 : false;
  }
}
