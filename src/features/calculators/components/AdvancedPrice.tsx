import React, { useEffect, useState } from "react";
import { Select, message } from "antd";

import SoftSkillPricing from "@/features/calculators/components/utils/Soft_Skill_Pricing";
import OneTimeWorkshopComponent from "@/features/calculators/components/utils/One_Time";
import AssessmentPrograms from "@/features/calculators/components/utils/AssessmentPrograms";
import Lms from "@/features/calculators/components/utils/Lms";

import { CalculatorViewApi } from "@/utils/api/Api";

type AdvancedPriceProps = {
  calculatordetails?: any; // made optional
  handleCloseBH?: () => void; // made optional
};

const AdvancedPrice: React.FC<AdvancedPriceProps> = ({
  calculatordetails,
  handleCloseBH,
}) => {
  const UserStatus = localStorage.getItem("UserStatus");

  const [firstSelectValue, setFirstSelectValue] = useState("Soft Skill");

  const handleFirstSelectChange = (value: string) => {
    setFirstSelectValue(value);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  const handleView = async () => {
    try {
      const id = calculatordetails?.calculatordetails?.id;
      if (id) {
        await CalculatorViewApi(id);
      }
    } catch (err) {
      console.log(err);
      message.error("Error loading calculator details");
    }
  };

  const blocked = UserStatus === "ACTIVATE TRIAL";

  return (
    <div className="AdvancedPrice">
      <Select
        style={{ width: "100%" }}
        value={firstSelectValue}
        onChange={handleFirstSelectChange}
        onClick={handleView}
        options={[
          { value: "Soft Skill", label: "Soft Skill Pricing Model" },
          { value: "One_Time", label: "One Time All Day Workshop" },
          { value: "AssessmentPrograms", label: "Assessment Programs" },
          { value: "Lms", label: "LMS" },
        ]}
      />

      <br />

      {firstSelectValue === "Soft Skill" && (
        <SoftSkillPricing handleCloseBH={handleCloseBH} />
      )}

      {firstSelectValue === "One_Time" &&
        (blocked ? (
          "To access One Time All Day Workshop, please subscribe to our service."
        ) : (
          <OneTimeWorkshopComponent handleCloseBH={handleCloseBH} />
        ))}

      {firstSelectValue === "AssessmentPrograms" &&
        (blocked ? (
          "To access Assessment Programs, please subscribe to our service."
        ) : (
          <AssessmentPrograms handleCloseBH={handleCloseBH} />
        ))}

      {firstSelectValue === "Lms" &&
        (blocked ? (
          "To access LMS, please subscribe to our service."
        ) : (
          <Lms handleCloseBH={handleCloseBH} />
        ))}
    </div>
  );
};

export default AdvancedPrice;
