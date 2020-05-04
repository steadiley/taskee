import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";

export interface UserState {
  userId: string;
  email: string;
}

@Module({ name: "user" })
export class UserStore extends VuexModule {
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
  login({ userId, email }: { userId: string; email: string | null }) {
    this.setUserId(userId);
    this.setEmail(email);
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
