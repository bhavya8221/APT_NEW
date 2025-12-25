import React, { useEffect, useState } from "react";
import { Table, Skeleton, Popconfirm, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { GetDraftCalculationApi, deleteDraft } from "@/utils/api/Api";
import { Button } from "@/components/ui/Button";
import NoDataImg from "@/assets/nodata.png";
import "./Draft.scss";

const { Title } = Typography;

interface DraftItem {
  id: number;
  draft_name: string | null;
  [key: string]: any;
}

const Draft: React.FC = () => {
  const [data, setData] = useState<DraftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false);

  const navigate = useNavigate();

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("UserLoginTokenApt")
      : null;

  useEffect(() => {
    if (!token) return;

    GetDraftCalculationApi()
      .then((res) => {
        const list = res?.data?.data || [];
        setData(list);
        setEmpty(list.length === 0);
      })
      .catch((error) => {
        console.error(error);
        setEmpty(true);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleEdit = (item: DraftItem) => {
    message.success("Loading draft…");

    setTimeout(() => {
      navigate(
        `/create/leadership-workshop-proposal/${item.id}?s=${item.draft_name}`,
        { state: item }
      );
      localStorage.removeItem("Calculation");
    }, 500);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDraft(id);
      message.success("Draft deleted");

      setData((prev) => prev.filter((d) => d.id !== id));
      if (data.length === 1) setEmpty(true);
    } catch (err) {
      console.error(err);
      message.error("Failed to delete draft");
    }
  };

  if (!token) {
    return (
      <div className="unauthenticated">
        <Title>Please sign in to continue.</Title>
      </div>
    );
  }

  return (
    <div className="DraftPage">
      <Title level={2}>Drafts</Title>

      {loading && <Skeleton active paragraph={{ rows: 6 }} />}

      {!loading && empty && (
        <div className="no-data-box">
          <img src={NoDataImg} alt="no-data" className="no-data-img" />
        </div>
      )}

      {!loading && !empty && (
        <Table
          dataSource={data}
          rowKey="id"
          pagination={false}
          className="draft-table"
          columns={[
            {
              title: <span className="table-header">Proposal Name</span>,
              dataIndex: "draft_name",
              render: (value) =>
                value ? (
                  <span>{value}</span>
                ) : (
                  <i style={{ opacity: 0.7 }}>Untitled Draft</i>
                ),
            },
            {
              title: <span className="table-header">Actions</span>,
              render: (_, record) => (
                <div className="draft-actions">
                  <Button variant="outline" onClick={() => handleEdit(record)}>
                    Edit
                  </Button>

                  <Popconfirm
                    title="Delete this draft?"
                    description="This action cannot be undone."
                    onConfirm={() => handleDelete(record.id)}
                    okText="Delete"
                    cancelText="Cancel"
                  >
                    <Button variant="outline" className="danger-btn">
                      Delete
                    </Button>
                  </Popconfirm>
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  );
};

export default Draft;
