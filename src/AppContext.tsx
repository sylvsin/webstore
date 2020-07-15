import axios, { AxiosInstance } from "axios";
import React, { createContext } from "react";

export interface AppConfig {
  api?: AxiosInstance;
}

interface Props {
  baseUrl: string
}

export const AppContext = createContext<AppConfig>({});

export const AppContextProvider: React.FC<Props> = ({ baseUrl, children }) => {
  const api = axios.create({
    baseURL: baseUrl,
  });
  return <AppContext.Provider value={{ api }}>{children}</AppContext.Provider>;
};
