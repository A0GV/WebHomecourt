import { useEffect, useState } from 'react';
import Nav from '../components/Nav'
import Button from '../components/button.tsx'

// API call using current year and month and compares against the user selected date
export async function getGames(year: number, month: number, date: number, time: number, currYear: number, currMonth: number) {
  let allGames: Array<number>; // For agenda to disp all games 
  // Query using all of the info w parametrized values to obtain all of the games in the current year and month selected 


  // For side display 
  let pastGames: Array<number>;
  let upcomingGames: Array<number>;
  

  // If selected month or selected year < curr month or curr year, viewing past games so adds all items to the list of past games 

  // Else if selected month and selected year > curr month and or curr year, viewing future games so adds all items to list of upcoming matches 

  // If current month and year are the same (aka will need to iterate list and div into past and upcoming matches) 
    // Checks all items and compares against current date and time 
    // If item date < selected date 
      // Adds to pastGames
    // Else if item date > selected date
      // Adds to upcomingGames
    // Else if item date == selected date 
      // If item time < time (current, user can't mod it)
        // Adds to pastGames
      // Else if item time > time 
        // Adds to upcomingGames
      // Else 
        // Print an error mssg to console  

  // Else no results so some error handling 

  // Return the lists of past and upcoming games 
} 
// Divide list into upcoming and past games using current date as reference to create two sublists

function Agenda() {
  const [showUpcoming, setShowUpcoming] = useState(true); // Shows upcoming default but can switch to past 

  // Default dates 
  /*
  const [currYear, setCurrYear] = useState(now.getFullYear()); // now.getFullYear()
  const [currMonth, setCurrMonth] = useState(now.getMonth());// For fetching months in agenda
  const [currDay, setCurrDay] = useState(now.getDay()); // Only use to show if curr month is the same as agenda month
  const [currTime, setCurrTime] = useState(now.getTime()); 

  // Default to curr year and month
  const [agendaYear, setAgendaYear] = useState(now.getFullYear()); // now.getFullYear()
  const [agendaMonth, setAgendaMonth] = useState(now.getMonth);// For fetching months in agenda
  const [agendaDay, setAgendaDay] = useState(); // Only use to show if curr month is the same as agenda month

  // Initial function to render
  useEffect(() => {
    // This code runs once after the initial render
    console.log("Agenda accessed");

    // Handle dates for agenda 
    // Curr date formatting set as default
    const now: Date = new Date();
    currYear = setCurrYear(now.getFullYear());

    // Set agenda variables to current default date and time 

    // Function for api call 
    getGames(currYear, currMonth, currDay, currTime, agendaYear, agendaMonth, agendaDay); 
});*/

// Funct to let user pick date from agenda, maybe this'll need to be handled in agenda component or as an export function idk
// important thing is that if the user wants to view any other month, the cagendaDay is set to day 1 and time as 12:01 am 
// to show either all as past or all as upcoming for that future entry

  return (
    <div className="flex flex-col items-center justify-center">
      <Nav current="Agenda" />
      <div className="px-14 py-5 bg-zinc-100 w-full">
        {/* Title comp */}
        <div className="w-full px-5 py-7 bg-violet-950 rounded-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-black/25 flex justify-between items-center overflow-hidden">
          <h1 className="justify-start text-white title1">Agenda</h1>
          <h3 className="justify-start text-white">2025 - 2026 Season</h3>
        </div>

        {/* Temp show component for info 
        <p>Current year: ${currYear}, month: ${currMonth} day: ${currDay} time: ${currTime}</p>*/}

        {/* Setup for agenda and matches list using grid */}
        <div className="grid grid-cols-6 gap-4 mt-4">
          {/* Space for agenda */}
          <div className="col-span-2 bg-gray-200 p-4">
            <p>Calendar</p>
          </div>

          {/* Side list view spanning 4 cols w buttons */}
          <div className="col-span-4 bg-gray-400 p-4">
            {/* Game type toggles*/}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="col-span-1">
                <Button
                  text="Upcoming Games"
                  type={showUpcoming ? 'primary' : 'secondary'}
                  onClick={() => setShowUpcoming(true)}
                  className="w-full"
                />
              </div>
              <div className="col-span-1">
                <Button
                  text="Past Games"
                  type={!showUpcoming ? 'primary' : 'secondary'}
                  onClick={() => setShowUpcoming(false)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Agenda list view, each item spans all 4 cols */}
            <div className="flex flex-col gap-2">
              {/* if showUpcoming == true, shows the UpcomingGameItem w upcomingGames list; else shows PastGameItem w pastGames list */}
              {showUpcoming ? <p>Upcoming games list</p>: <p>Past games list</p>}
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default Agenda
