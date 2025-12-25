import React, { useState } from 'react';
import { Form, Row } from 'react-bootstrap';
const MastermindGroup = () => {
  const [experience_level, setExperience_level] = useState('');
  const [week, setWeek] = useState('');

  const levelsData = {
    'Beginner': {
      '4': { amount: "$50 - $100" },
      '6': { amount: "$65 - $130" },
      '10': { amount: "$100 - $150" }
    },
    'Intermediate': {
      '4': { amount: "$100 - $200" },
      '6': { amount: "$130 - $215" },
      '10': { amount: "$150 - $235" }
    },
    'Pro': {
      '4': { amount: "$200 - $300" },
      '6': { amount: "$225 - $400" },
      '10': { amount: "$350 - $485" }
    },
    'Advanced Pro': {
      '4': { amount: "$500 - $750" },
      '6': { amount: "$425 - $1000" },
      '10': { amount: "$1,100 - $2,000" }
    }
  };
  const amount = experience_level && week ? levelsData[experience_level][week]?.amount : '';
  return (
    <div className="MastermindGroup">
      <h5>Mastermind Group</h5>
      <Row >
        <Form.Group className='mb-2'>
          <Form.Label>Question:</Form.Label>
          <Form.Select >
            <option value="">select question---</option>
            <option value="How much should I charge a MastermindGroup client">I am putting together a Mastermind, how much should I charge?</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className='mb-2' >
          <Form.Label>How many weeks is the Mastermind?: </Form.Label>
          <Form.Select value={week} onChange={(e) => setWeek(e.target.value)}>
            <option value="">Select People</option>
            <option value="4">4 week</option>
            <option value="6">6 week</option>
            <option value="10">10 week</option>
            {/* {Object.keys(levelsData).map((level, index) => (
                <option key={index} value={level}>
                  {level}
                </option>
              ))} */}
          </Form.Select>
        </Form.Group>
        <Form.Group className='mb-2' >
          <Form.Label>Based on information provided, the suggested per person fee should be:</Form.Label>
          <Form.Select value={experience_level} onChange={(e) => setExperience_level(e.target.value)}>
            <option value="">Select experience level</option>
            {Object.keys(levelsData).map((level, index) => (
              <option key={index} value={level}>
                {level}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <div className='Row_1'>
          <div className='Col_1 blank_input'>
            Fee Amount :
            <div className='Col_12 blank_input'>
              {amount}
            </div>
          </div>
        </div>
      </Row>
    </div>
  );
};
export default MastermindGroup;