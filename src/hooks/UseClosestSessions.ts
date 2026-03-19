import { useMemo } from "react";
import { Session } from "../types/authTypes";

const padDate = (n: number) => String(n).padStart(2, "0");

const toYYYYMMDD = (date: Date): string => {
  return `${date.getFullYear()}-${padDate(date.getMonth() + 1)}-${padDate(date.getDate())}`;
};

interface ClosestSessionInfo {
  label: string;
  times: string[];
  dateString: string | null;
}

/**
 * useClosestSessions — повторна логіка з MovieCard,
 * визначає найближчі сесії для відображення на головній сторінці.
 */
export const useClosestSessions = (sessions: Session[]): ClosestSessionInfo => {
  return useMemo(() => {
    if (!sessions || sessions.length === 0) {
      return { label: "", times: [], dateString: null };
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todayStr = today.toDateString();
    const tomorrowStr = tomorrow.toDateString();

    const toTime = (dt: string) =>
      new Date(dt).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });

    const todaySessions = sessions.filter(
      (s) => new Date(s.dateTime).toDateString() === todayStr
    );
    if (todaySessions.length > 0) {
      return {
        label: "Sessions today:",
        times: todaySessions.map((s) => toTime(s.dateTime)),
        dateString: toYYYYMMDD(today),
      };
    }

    const tomorrowSessions = sessions.filter(
      (s) => new Date(s.dateTime).toDateString() === tomorrowStr
    );
    if (tomorrowSessions.length > 0) {
      return {
        label: "Sessions tomorrow:",
        times: tomorrowSessions.map((s) => toTime(s.dateTime)),
        dateString: toYYYYMMDD(tomorrow),
      };
    }

    const futureSessions = sessions
      .filter((s) => new Date(s.dateTime) > today)
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

    if (futureSessions.length > 0) {
      const closest = new Date(futureSessions[0].dateTime);
      const label = `Sessions ${closest.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
      })}:`;

      const sessionsOnDate = futureSessions.filter(
        (s) => new Date(s.dateTime).toDateString() === closest.toDateString()
      );

      return {
        label,
        times: sessionsOnDate.map((s) => toTime(s.dateTime)),
        dateString: toYYYYMMDD(closest),
      };
    }

    return { label: "", times: [], dateString: null };
  }, [sessions]);
};