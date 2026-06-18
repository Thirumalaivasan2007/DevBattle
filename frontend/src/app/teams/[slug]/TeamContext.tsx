"use client";

import React, { createContext, useContext } from 'react';

const TeamContext = createContext<any>(null);

export function TeamProvider({ children, team, fetchTeam }: { children: React.ReactNode, team: any, fetchTeam: () => void }) {
  return (
    <TeamContext.Provider value={{ team, fetchTeam }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  return useContext(TeamContext);
}
