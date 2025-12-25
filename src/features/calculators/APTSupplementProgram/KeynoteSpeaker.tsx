import React, { useState } from 'react';

import { Form, Row } from 'react-bootstrap';

const KeynoteSpeaker = () => {
  const [experience_level, setExperience_level] = useState('');
  const levelsData = {
    'Beginner': { amount: "$500 - $750" },
    'Intermediate': { amount: "$1500 - $1750" },
    'Pro': { amount: "$4500 - $7000" },
    'Advanced Pro': { amount: "$7500 - $10,000" },
  };


  const amount = experience_level ? levelsData[experience_level]?.amount : '';

  return (
    <div className="KeynoteSpeaker">
     
        <h5>Keynote Speaker</h5>
        <h6 className='upto_one'>(up to 1 hour)</h6>
        <Row >
          <Form.Group className='mb-2'>
            <Form.Label>Question:</Form.Label>
            <Form.Select >
              <option value="">select question---</option>
              <option value="How much should I charge a Keynote Speaker client">I have been asked to be a Keynote Speaker, what should I charge?</option>
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

export default KeynoteSpeaker;
