import { useState, useCallback } from "react";
import {
  Button,
  Popover,
  ActionList,
  Page,
  LegacyCard,
  Select,
  TextField,
  RadioButton,
  FormLayout,
  Checkbox,
  Text,
  Grid,
  Icon,
} from "@shopify/polaris";

import {
  AlertTriangleIcon,
  DeleteIcon,
  PlusIcon,
} from "@shopify/polaris-icons";

import Payment from "./PaymentMethod";
import conditions from "./data/conditionsData";
import "./App.css";

interface Condition {
  id: number;
  content: string;
  description: string;
  icon?: React.ComponentType;
}

function App() {
  const [popoverActive, setPopoverActive] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState<Condition[]>([]);
  const [ruleName, setRuleName] = useState("");
  const [hide, setHide] = useState(true);
  const [sort, setSort] = useState(false);
  const [rename, setRename] = useState(false);
  const [matchCondition, setMatchCondition] = useState("all");
  const [collectionCondition, setCollectionCondition] = useState("");
  const [collectionInput, setCollectionInput] = useState("");
  const [productAmount, setProductAmount] = useState("");
  const [paymentData, setPaymentData] = useState({
    selectedMethods: [] as string[],
    orderNumbers: {} as { [key: string]: string },
  });

  const togglePopoverActive = useCallback(
    () => setPopoverActive((active) => !active),
    []
  );

  const handlePaymentChange = (data: {
    selectedMethods: string[];
    orderNumbers: { [key: string]: string };
  }) => {
    setPaymentData(data);
  };

  const addCondition = (condition: Omit<Condition, "id">) => {
    setSelectedConditions((prev) => [
      ...prev,
      { ...condition, id: Date.now() },
    ]);
    setPopoverActive(false);
  };

  const removeCondition = (id: number) => {
    setSelectedConditions((prev) =>
      prev.filter((condition) => condition.id !== id)
    );
  };

  const handleSubmit = () => {
    const formData = {
      ruleName,
      paymentMethods: { hide, sort, rename },
      paymentData,
      matchCondition,
      conditions: selectedConditions,
    };
    console.log("Form submitted with data:", formData);
  };

  const activator = (
    <div className="mb-4">
      <Button icon={PlusIcon} onClick={togglePopoverActive}>
        Add a new condition
      </Button>
    </div>
  );

  return (
    <Page backAction={{ content: "rule", url: "/" }} title="Add Rule Settings">
      <Grid gap={{ xs: "loose", md: "tight" }}>
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 8, xl: 8 }}>
          <Popover
            active={popoverActive}
            activator={activator}
            preferredAlignment="left"
            onClose={togglePopoverActive}
          >
            <ActionList
              items={conditions.map((condition) => ({
                content: (
                  <div className="flex items-start space-x-2">
                    <div>
                      <Icon source={condition.icon}></Icon>
                    </div>{" "}
                    <div className="font-semibold">
                      {condition.content}{" "}
                      <span className="text-gray-500 font-normal text-[12px] ml-[2px]">
                        {condition.description}
                      </span>
                    </div>{" "}
                  </div>
                ),
                onAction: () => addCondition(condition),
              }))}
            />
          </Popover>

          <FormLayout>
            <LegacyCard title="Conditions" sectioned>
              {selectedConditions.length > 0 ? (
                selectedConditions.map((condition) => (
                  <div
                    key={condition.id}
                    style={{
                      border: "1px solid #dfe3e8",
                      padding: "10px",
                      marginBottom: "10px",
                      borderRadius: "4px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <strong>{condition.content}</strong>
                      <Button
                        icon={DeleteIcon}
                        onClick={() => removeCondition(condition.id)}
                      >
                        Remove
                      </Button>
                    </div>
                    <div style={{ marginTop: "8px", color: "#5c5f62" }}>
                      {condition.description}
                    </div>
                    {condition.content === "Collections" && (
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <Select
                          label="Condition"
                          options={[
                            { label: "If found", value: "found" },
                            { label: "If not found", value: "not_found" },
                          ]}
                          value={collectionCondition}
                          onChange={setCollectionCondition}
                        />
                        <TextField
                          label="Collections"
                          placeholder="Enter collections"
                          value={collectionInput}
                          onChange={setCollectionInput}
                          autoComplete="off"
                        />
                      </div>
                    )}
                    {condition.content === "Products" && (
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <Select
                          label="Apply if"
                          options={[
                            { label: "More than", value: "more_than" },
                            { label: "Less than", value: "less_than" },
                          ]}
                          value={productAmount}
                          onChange={setProductAmount}
                        />
                        <TextField
                          label="Amount"
                          type="number"
                          placeholder="Enter amount"
                          value={productAmount}
                          onChange={setProductAmount}
                          autoComplete="off"
                        />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No conditions added yet</p>
              )}
            </LegacyCard>

            <LegacyCard title="Rule Settings" sectioned>
              <TextField
                label="Rule name"
                value={ruleName}
                onChange={setRuleName}
                placeholder="Enter rule name"
                autoComplete="off"
              />
              <div style={{ marginTop: "10px" }}>
                <div>
                  <Checkbox
                    label="Hide"
                    tone="magic"
                    checked={hide}
                    onChange={() => setHide(!hide)}
                  />
                </div>
                <div>
                  <Checkbox
                    tone="magic"
                    label="Sort"
                    checked={sort}
                    onChange={() => setSort(!sort)}
                  />
                </div>
                <div>
                  <Checkbox
                    tone="magic"
                    label="Rename"
                    checked={rename}
                    onChange={() => setRename(!rename)}
                  />
                </div>
              </div>
              <div style={{ marginTop: "10px" }}>
                <Text as="span" fontWeight="bold">
                  Match condition
                </Text>
                <div className="flex flex-col ">
                  <RadioButton
                    tone="magic"
                    label="All specified conditions above must be met to change the payment methods"
                    checked={matchCondition === "all"}
                    onChange={() => setMatchCondition("all")}
                  />
                  <RadioButton
                    tone="magic"
                    label="Any of the specified conditions is sufficient to change the payment methods"
                    checked={matchCondition === "any"}
                    onChange={() => setMatchCondition("any")}
                  />
                </div>
              </div>
            </LegacyCard>

            <Payment
              sort={sort}
              rename={rename}
              onChange={handlePaymentChange}
            />
          </FormLayout>

          <div style={{ margin: "20px 0" }}>
            <Button tone="critical" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </Grid.Cell>

        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
          <div className="rounded-xl bg-[#fff] mb-4 shadow-md">
            <div className="bg-[#FDAE00] px-2 py-[10px] font-semibold flex items-center gap-2 rounded-t-xl">
              <div>
                <Icon source={AlertTriangleIcon} />
              </div>
              No plan needed!
            </div>
            <p className="p-2 py-3">Forever free for development store.</p>
          </div>
          <LegacyCard title="Support" sectioned>
            <div className="mb-2">
              <p>
                If you need assistance, please reach out to our support team
                using the button below.
              </p>
            </div>
            <Button>Contact support</Button>
          </LegacyCard>
          <LegacyCard title="Share logs" sectioned>
            <div className="mb-2">
              <p>
                If you need assistance, please reach out to our support team
                using the button below.
              </p>
            </div>
            <Button>How to share logs</Button>
          </LegacyCard>
        </Grid.Cell>
      </Grid>
    </Page>
  );
}

export default App;
