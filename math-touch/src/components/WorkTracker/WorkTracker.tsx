import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";

const WorkTracker: React.FC = () => {
  const [isWorking, setIsWorking] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [workDuration, setWorkDuration] = useState<number | null>(null);
  const [report, setReport] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isWorking && startTime) {
      const interval = setInterval(() => {
        const now = new Date();
        setWorkDuration(Math.floor((now.getTime() - startTime.getTime()) / 1000)); // Duration in seconds
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isWorking, startTime]);

  const startWork = () => {
    setStartTime(new Date());
    setIsWorking(true);
  };

  const endWork = () => {
    setIsWorking(false);
    setStartTime(null);
    setWorkDuration(null);
  };

  const handleReportChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReport(event.target.value);
  };

  const formatDuration = (seconds: number | null): string => {
    if (seconds === null) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {isWorking ? `Працюю (${currentTime.toLocaleDateString()})` : 'Почати робочий день'}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {isWorking ? (
          <>
            <Dropdown.Item href="#/action-1">
              Ви працюєте {formatDuration(workDuration)}. 
            </Dropdown.Item>
            <Dropdown.Item href="#/action-2">
              <textarea
                value={report}
                onChange={handleReportChange}
                placeholder="Enter work report here..."
                rows={4}
                cols={30}
              />
            </Dropdown.Item>
            <Dropdown.Item href="#/action-3">
              <button onClick={endWork}>Завершити робочий день</button>
            </Dropdown.Item>
          </>
        ) : (
          <Dropdown.Item href="#/action-1">
            <button onClick={startWork}>Розпочати робочий день</button>
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default WorkTracker;