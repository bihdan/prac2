import { useState, useEffect } from "react";
import "./StatisticBox.css";
import calendar_icon from "../../assets/calendar-icon.png"
import stats_icon from "../../assets/stats-icon.png"

function StatisticBox({activity}){

    const [isCalendarType, SetIsCalendarType] = useState(false);

    const handleSwitchType = () => {
        if(isCalendarType){
            SetIsCalendarType(false);
        } else {
            SetIsCalendarType(true);
        }
    };

    const [weeklyStats, setWeeklyStats] = useState([]);

    useEffect(() => {
        const today = new Date();
        const generatedStats = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const isoDate = date.toISOString().slice(0, 10);

            const dayStats = activity[isoDate] || { added: 0, reviewed: 0, time: 0 };

            generatedStats.push({
                date: isoDate,
                added: dayStats.added || 0,
                reviewed: dayStats.reviewed || 0,
                time: dayStats.time || 0
            });
        }

        setWeeklyStats(generatedStats);
    }, [activity]);


    const getMaxValues = () => {
        const defaultMax = { added: 1, reviewed: 1, time: 1 }; 

        return weeklyStats.reduce(
        (max, day) => ({
            added: Math.max(max.added, day.added || 0),
            reviewed: Math.max(max.reviewed, day.reviewed || 0),
            time: Math.max(max.time, day.time || 0)
        }),
        defaultMax
        );
    };

    const maxValues = getMaxValues();
  
    const getBarHeight = (value, max, day) => {

         
        const tempo = max ? `${(value / max) * 100}%` : "0%";
        //console.log("value ", value,"max ", max,"tempo ", tempo,"day ", day);

        return tempo
    };


    return (
        <div className="statisticBox oneOfMainBlock">
            <div className="totalStatsButton">

                <img 
                    src={isCalendarType ? stats_icon : calendar_icon}
                    className="switchType_button"
                    alt={isCalendarType ? "Календарна статистика" : "Гістограмна статистика"} 
                    onClick={handleSwitchType}
                    role="button"
                />
            

            </div>

            {!isCalendarType && (
                <div className="weekStatisticBox">
                    <div className="weekStats" id="weekStats">
                        {weeklyStats.map((day, index) => (
                            <div className="chartAndDate"  key={index}>

                                <div className="chart_day">
                                    <div
                                        className="bar added"
                                        style={{ height: getBarHeight(day.added, maxValues.added, day.date ) }}
                                        title={`Додано: ${day.added}`}
                                    />
                                    <div
                                        className="bar reviewed"
                                        style={{ height: `${(day.reviewed / maxValues.reviewed) * 100}%` }}
                                        title={`Пройдено: ${day.reviewed}`}
                                    />
                                    <div
                                        className="bar time"
                                        style={{ height: `${(day.time / maxValues.time) * 100}%` }}
                                        title={`Час: ${day.time}s`}
                                    />
                                </div>

                                <div className="dayDisplay">
                                    {day.date.slice(8, 10)}
                                </div>
                            </div>
                        ))}
          
                    </div>

                </div>
            )}

            {isCalendarType && (
                <div className="calendarStatisticBox">
                    <div className="calendarStats" id="calendarStats">

                    </div>
                    <div>

                    </div>
                </div>
            )}

            
        </div>
    );
}

export default StatisticBox;