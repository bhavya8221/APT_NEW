import React, { useState } from 'react';

import { Form, Row } from 'react-bootstrap';

const Coaching = () => {
  const [experience_level, setExperience_level] = useState('');
  const levelsData = {
    'Beginner': { amount: "$75 - $100/hour" },
    'Intermediate': { amount: "$150 - $200/hour" },
    'Pro': { amount: "$200 - $250/hour" },
    'Advanced Pro': { amount: "$500 - $750/hour" },
  };

  

  const amount = experience_level ? levelsData[experience_level]?.amount : '';

  return (
    <div className="Coaching">
    
        <h5>Coaching</h5>
        <Row >
          <Form.Group className='mb-2'>
            <Form.Label>Question:</Form.Label>
            <Form.Select >
              <option value="">select question---</option>
              <option value="How much should I charge a coaching client">How much should I charge a coaching client?</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className='mb-2' >
            <Form.Label>Suggested fee is based on experience level: </Form.Label>
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

export default Coaching;
