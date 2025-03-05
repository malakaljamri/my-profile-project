import * as fetch from "./fetch_data.jsx";
import { useEffect } from "react";
import React, { useState } from "react";


export function UserSkills() {
  const [Skills, setUserSkills] = useState(null);

  useEffect(() => {
    async function fetchAndSetUserData() {
      try {
        const data = await fetch.fetchSkills();
        const highestPercentageBySkill = {};

        // Iterate through the skills data to find the highest percentage for each skill type
        data.forEach((skill) => {
          const { amount, type } = skill;
          const trimmedType = type.replace('skill_', '');

          if (
            !(type in highestPercentageBySkill) || 
            amount > highestPercentageBySkill[type].amount
          ) {

            highestPercentageBySkill[type] = { amount, type:trimmedType };
          }
        });

        // Extract the values from the object to get the filtered array
        const filteredSkillsData = Object.values(highestPercentageBySkill);
        setUserSkills(filteredSkillsData);
      } catch (error) {
        console.log(error);
      }
    }
    fetchAndSetUserData();
  }, []);

  if (!Skills) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }
  const colors = ["#e78ae8", "#6c79b8", "#55bace", "#cc55ce", " #3c9ee5"];
  return (
    <div className="UserData Skills">
      <p className="Skills-header">Skills</p>
      <div className="flex-wrapper">
        {Skills.map((skill, index) => (
          <div className="single-chart" key={index}>
            <svg
              viewBox="0 0 36 36"
              className="circular-chart"
              style={{ stroke: colors[index % colors.length] }}
            >
              <path
                className="circle-bg"
                d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="circle"
                strokeDasharray={`${skill.amount}, 100`}
                d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <g style={{ stroke: "none" }}>
                <text x="18" y="20.35" className="percentage">
                  <tspan x="18" dy="-0.7em">
                    {skill.type}
                  </tspan>
                  <tspan x="18" dy="1.2em">
                    {skill.amount}%
                  </tspan>
                </text>
              </g>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
