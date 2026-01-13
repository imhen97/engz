import { useEffect } from "react";
import { useLearningStore } from "@/store/useLearningStore";
import type { Routine, Mission } from "@prisma/client";

export function useLearningData(userId: string | undefined) {
  const {
    setCurrentRoutine,
    setMissions,
    setTodayMission,
    setLoading,
    updateStreak,
  } = useLearningStore();

  useEffect(() => {
    if (!userId) return;

    const fetchLearningData = async () => {
      setLoading("routine", true);
      try {
        const response = await fetch("/api/learning-room/data");
        const data = await response.json();
        
        // Handle API response with success flag (if API is updated)
        if (data.success && data.routine) {
          setCurrentRoutine(data.routine);
          setMissions(data.missions || []);
          setTodayMission(data.todayMission || null);
          updateStreak();
        } 
        // Handle current API response format
        else if (data.id && data.theme) {
          // Create Routine object from API response
          const routine: Routine = {
            id: data.id,
            userId: userId,
            theme: data.theme,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            completed: data.completed || false,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          setCurrentRoutine(routine);
          
          // If todayMission exists, create Mission object
          if (data.todayMission) {
            const todayMission: Mission = {
              id: data.todayMission.id,
              routineId: data.id,
              week: data.todayMission.week,
              day: data.todayMission.day,
              content: data.todayMission.content,
              aiFeedback: data.todayMission.aiFeedback || null,
              completed: data.todayMission.completed || false,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            
            setTodayMission(todayMission);
          } else {
            setTodayMission(null);
          }
          
          // Note: Current API doesn't return all missions, only todayMission
          // Set empty missions array - missions will be loaded separately if needed
          setMissions([]);
          updateStreak();
        } 
        // No routine found
        else {
          setCurrentRoutine(null);
          setMissions([]);
          setTodayMission(null);
        }
      } catch (error) {
        console.error("Failed to fetch learning data:", error);
      } finally {
        setLoading("routine", false);
      }
    };

    fetchLearningData();
  }, [userId, setCurrentRoutine, setMissions, setTodayMission, setLoading, updateStreak]);
}
