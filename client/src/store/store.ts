import axios from "axios";
import { makeAutoObservable } from "mobx";
import { API_URL } from "../http";
import { IUser } from "../models/IUser";
import { AuthResponse } from "../models/response/AuthResponse";
import AuthService from "../services/AuthService";

export default class Store {
  user = {} as IUser;
  isAuth = false;
  isLoading = false;
  constructor() {
    makeAutoObservable(this)

  }
  setAuth(bool: boolean) {
    this.isAuth = bool;
  }

  setLoding(bool: boolean) {
    this.isLoading = bool
  }

  setUser(user: IUser) {
    this.user = user
  }

  async login(email: string, password: string) {
    try {
      const response = await AuthService.login(email, password);
      console.log(response)

      localStorage.setItem('token', response.data.accessToken);
      this.setUser(response.data.user)
      this.setAuth(true);

    } catch (error) {
      console.log(error)
    }
  }
  async registration(email: string, password: string) {
    try {
      const response = await AuthService.registration(email, password);
      console.log(response)

      localStorage.setItem('token', response.data.accessToken);
      this.setUser(response.data.user)
      this.setAuth(true);

    } catch (error) {
      console.log(error)
    }
  }

  async logout() {
    try {
      const response = await AuthService.logout();
      console.log(response)
      localStorage.removeItem('token');
      this.setUser({} as IUser)
      this.setAuth(false);

    } catch (error) {
      console.log(error)
    }
  }

  async checkAuth() {
    this.setLoding(true);
    try {
      const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true})
      console.log(response)

      localStorage.setItem('token', response.data.accessToken);
      this.setUser(response.data.user)
      this.setAuth(true);
    } catch (error) {
      console.log(error)
    } finally {
      this.setLoding(false)
    }
  }
}
