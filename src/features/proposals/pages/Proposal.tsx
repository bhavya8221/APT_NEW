import React, { useEffect, useState } from "react";
import { Drawer, List, Row, Col, Pagination, Spin, Typography } from "antd";
import Banner from "@/components/layout/Banner";
import CardComponent from "@/components/ui/Card";
import { Image_URL } from "@/utils/constants/host";
import {
  GetProposalCategoryList,
  ProposalByCategoryApi,
} from "@/utils/api/Api";
import { FaFilter as FaFilterRaw } from "react-icons/fa";
import "./Proposal.scss";

// Cast icon for TS compatibility
const FaFilter = FaFilterRaw as React.FC<React.SVGProps<SVGSVGElement>>;

const { Title } = Typography;

// Types ------------------------------------------------------------------

interface CategoryItem {
  title: string;
  slug: string;
  file_name: string;
}

interface APIProposal {
  id: number;
  title: string;
  file_name: string;
  file_type?: string;
  proposal_type?: string;
}

// UI-safe format for CardComponent
interface ProposalCardShape {
  id: number;
  title: string;
  file_name: string;
  file_type: string;
  proposal_type: string;
}

// Component --------------------------------------------------------------

export default function Proposal() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [proposals, setProposals] = useState<APIProposal[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIndex, setSelectedIndex] = useState<string | number>("all");

  const [title, setTitle] = useState("All Proposal");
  const [img, setImage] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [page, setPage] = useState(1);
  const PER_PAGE = 6;
  const [totalCount, setTotalCount] = useState(0);

  const userToken =
    typeof window !== "undefined"
      ? localStorage.getItem("UserLoginTokenApt")
      : null;

  // Fetch categories -----------------------------------------------------

  useEffect(() => {
    GetProposalCategoryList()
      .then((res) => {
        setCategories(res?.data?.data || []);
      })
      .catch(console.error);
  }, []);

  // Fetch proposals ------------------------------------------------------

  useEffect(() => {
    ProposalByCategoryApi(selectedCategory, PER_PAGE, page)
      .then((res) => {
        setProposals(res?.data?.data?.rows || []);
        setTotalCount(res?.data?.data?.count || 0);
      })
      .catch(console.error);
  }, [selectedCategory, page]);

  // Handlers -------------------------------------------------------------

  const handleCategoryClick = (
    idx: number | string,
    title: string,
    slug: string,
    fileName: string
  ) => {
    setSelectedIndex(idx);
    setSelectedCategory(slug);
    setTitle(title);
    setImage(fileName);

    setDrawerOpen(false);
  };

  const categoryList = (
    <>
      <Title level={4} className="categoryText">
        Categories
      </Title>

      <List
        className="category_list"
        dataSource={[
          { title: "All Category", slug: "all", file_name: "" },
          ...categories,
        ]}
        renderItem={(item, idx) => {
          const isActive =
            (idx === 0 && selectedIndex === "all") || selectedIndex === idx - 1;

          return (
            <List.Item
              className={`category_item ${isActive ? "selectedCategory" : ""}`}
              style={{ cursor: "pointer" }}
              onClick={() =>
                handleCategoryClick(
                  idx === 0 ? "all" : idx - 1,
                  item.title,
                  item.slug,
                  item.file_name
                )
              }
            >
              {item.title}
            </List.Item>
          );
        }}
      />
    </>
  );

  if (!userToken) {
    return (
      <div className="unauthenticated">
        <Title>Please sign in to view proposals.</Title>
      </div>
    );
  }

  // Render ---------------------------------------------------------------

  return (
    <div className="ProposalPage">
      <Banner
        CalculatorName={title}
        CalculatorImage={
          selectedCategory === "all" ? "/assets/proposal.jpg" : Image_URL + img
        }
      />

      <div className="filter_icon" onClick={() => setDrawerOpen(true)}>
        <FaFilter width={22} height={22} /> <span>Filter</span>
      </div>

      <Drawer
        title="Categories"
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width="80%"
      >
        {categoryList}
      </Drawer>

      <div className="proposal_container">
        {/* Sidebar (Desktop) */}
        <div className="sidebar">{categoryList}</div>

        {/* Content */}
        <div className="content">
          {proposals.length === 0 ? (
            <div className="loader-container">
              <Spin size="large" />
              <p>No proposals available...</p>
            </div>
          ) : (
            <Row gutter={[24, 24]}>
              {proposals.map((item, index) => {
                const fixedData: ProposalCardShape = {
                  id: item.id,
                  title: item.title,
                  file_name: item.file_name,
                  file_type: item.file_type ?? "pdf",
                  proposal_type: item.proposal_type ?? "standard",
                };

                return (
                  <Col xs={24} sm={12} md={12} key={index}>
                    <CardComponent data={fixedData} />
                  </Col>
                );
              })}
            </Row>
          )}

          <div className="pagination_custom">
            <Pagination
              current={page}
              total={totalCount}
              pageSize={PER_PAGE}
              onChange={(p) => setPage(p)}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
