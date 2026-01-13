"use client";

import { useState } from "react";

interface Mission {
  id: string;
  week: number;
  day: number;
  content: string;
  aiFeedback?: string | null;
  completed: boolean;
}

interface AllMissionsViewProps {
  missions: Mission[];
  currentWeek: number;
  currentDay: number;
  onMissionClick: (mission: Mission) => void;
}

export default function AllMissionsView({
  missions,
  currentWeek,
  currentDay,
  onMissionClick,
}: AllMissionsViewProps) {
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);

  // Group missions by week
  const missionsByWeek: { [key: number]: Mission[] } = {};
  missions.forEach((mission) => {
    if (!missionsByWeek[mission.week]) {
      missionsByWeek[mission.week] = [];
    }
    missionsByWeek[mission.week].push(mission);
  });

  const weeks = [1, 2, 3, 4];

  const getWeekProgress = (week: number) => {
    const weekMissions = missionsByWeek[week] || [];
    const completed = weekMissions.filter((m) => m.completed).length;
    return { completed, total: weekMissions.length };
  };

  const isMissionAccessible = (mission: Mission) => {
    // Mission is accessible if:
    // 1. It's already completed
    // 2. It's the current day or earlier
    if (mission.completed) return true;
    if (mission.week < currentWeek) return true;
    if (mission.week === currentWeek && mission.day <= currentDay) return true;
    return false;
  };

  const getMissionStatus = (mission: Mission) => {
    if (mission.completed) return "completed";
    if (mission.week === currentWeek && mission.day === currentDay) return "current";
    if (isMissionAccessible(mission)) return "available";
    return "locked";
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:rounded-3xl sm:p-8">
      <h2 className="mb-6 text-lg font-semibold text-gray-900 sm:text-xl">
        📚 전체 학습 커리큘럼
      </h2>

      {/* Week Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {weeks.map((week) => {
          const { completed, total } = getWeekProgress(week);
          const isCurrentWeek = week === currentWeek;
          const isSelected = week === selectedWeek;

          return (
            <button
              key={week}
              onClick={() => setSelectedWeek(week)}
              className={`flex min-w-[100px] flex-col items-center rounded-xl px-4 py-3 transition ${
                isSelected
                  ? "bg-[#F5472C] text-white"
                  : isCurrentWeek
                  ? "bg-[#FFF7F0] text-[#F5472C]"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span className="text-sm font-semibold">{week}주차</span>
              <span className={`mt-1 text-xs ${isSelected ? "text-white/80" : "text-gray-500"}`}>
                {completed}/{total} 완료
              </span>
            </button>
          );
        })}
      </div>

      {/* Week Progress Bar */}
      <div className="mb-6">
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#F5472C] to-[#ff6a3c] transition-all duration-500"
            style={{
              width: `${
                (getWeekProgress(selectedWeek).completed /
                  Math.max(getWeekProgress(selectedWeek).total, 1)) *
                100
              }%`,
            }}
          />
        </div>
      </div>

      {/* Mission List */}
      <div className="space-y-3">
        {(missionsByWeek[selectedWeek] || [])
          .sort((a, b) => a.day - b.day)
          .map((mission) => {
            const status = getMissionStatus(mission);
            const isAccessible = isMissionAccessible(mission);

            return (
              <button
                key={mission.id}
                onClick={() => isAccessible && onMissionClick(mission)}
                disabled={!isAccessible}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  status === "completed"
                    ? "border-green-200 bg-green-50 hover:bg-green-100"
                    : status === "current"
                    ? "border-[#F5472C] bg-[#FFF7F0] hover:bg-[#ffe8dc]"
                    : status === "available"
                    ? "border-gray-200 bg-white hover:border-[#F5472C] hover:bg-[#FFF7F0]"
                    : "cursor-not-allowed border-gray-100 bg-gray-50 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                          status === "completed"
                            ? "bg-green-500 text-white"
                            : status === "current"
                            ? "bg-[#F5472C] text-white"
                            : status === "available"
                            ? "bg-gray-200 text-gray-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {status === "completed" ? "✓" : mission.day}
                      </span>
                      <span className="text-xs font-medium text-gray-500">
                        Day {mission.day}
                      </span>
                      {status === "current" && (
                        <span className="rounded-full bg-[#F5472C] px-2 py-0.5 text-[10px] font-semibold text-white">
                          오늘
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-900">{mission.content}</p>
                    {mission.aiFeedback && (
                      <p className="mt-2 text-xs text-gray-500">
                        💬 {mission.aiFeedback.slice(0, 50)}...
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {status === "completed" ? (
                      <span className="text-green-500">✅</span>
                    ) : status === "locked" ? (
                      <span className="text-gray-300">🔒</span>
                    ) : (
                      <span className="text-[#F5472C]">→</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
      </div>

      {/* Empty State */}
      {(!missionsByWeek[selectedWeek] || missionsByWeek[selectedWeek].length === 0) && (
        <div className="py-8 text-center">
          <p className="text-gray-500">이 주차에는 아직 미션이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
