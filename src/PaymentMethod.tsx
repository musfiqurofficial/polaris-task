import { useState, useCallback, useMemo, useEffect } from "react";
import {
  Autocomplete,
  Button,
  LegacyCard,
  Select,
  Text,
  TextField,
} from "@shopify/polaris";
import { PlusIcon, XIcon } from "@shopify/polaris-icons";

function Payment({
  sort,
  rename,
  onChange,
}: {
  sort: boolean;
  rename: boolean;
  onChange: (data: {
    selectedMethods: string[];
    orderNumbers: { [key: string]: string };
  }) => void;
}) {
  const deselectedOptions = useMemo(
    () => [
      { value: "Cash on Delivery (COD)", label: "Cash on Delivery (COD)" },
      { value: "Amazon Pay", label: "Amazon Pay" },
      { value: "PayPal", label: "PayPal" },
    ],
    []
  );

  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState(deselectedOptions);
  const [orderNumbers, setOrderNumbers] = useState<{ [key: string]: string }>(
    {}
  );
  const [selected, setSelected] = useState("replace");

  const handleSelectChange = useCallback(
    (value: string) => setSelected(value),
    []
  );

  const renameOptions = [
    { label: "Replace With", value: "replace" },
    { label: "Add Before", value: "before" },
    { label: "Add After", value: "after" },
  ];

  const updateText = useCallback(
    (value: string) => {
      setInputValue(value);

      if (value === "") {
        setOptions(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(value, "i");
      const resultOptions = deselectedOptions.filter((option) =>
        option.label.match(filterRegex)
      );
      setOptions(resultOptions);
    },
    [deselectedOptions]
  );

  const addPaymentMethod = useCallback(() => {
    if (inputValue.trim() && !selectedMethods.includes(inputValue)) {
      setSelectedMethods((prev) => [...prev, inputValue.trim()]);
    }
    setInputValue("");
  }, [inputValue, selectedMethods]);

  const removePaymentMethod = useCallback((method: string) => {
    setSelectedMethods((prev) => prev.filter((m) => m !== method));
    setOrderNumbers((prev) => {
      const updatedOrderNumbers = { ...prev };
      delete updatedOrderNumbers[method];
      return updatedOrderNumbers;
    });
  }, []);

  const handleOrderNumberChange = useCallback(
    (method: string, value: string) => {
      setOrderNumbers((prev) => ({ ...prev, [method]: value }));
    },
    []
  );
  
  useEffect(() => {
    onChange({ selectedMethods, orderNumbers });
  }, [selectedMethods, orderNumbers, onChange]);

  const textField = (
    <Autocomplete.TextField
      onChange={updateText}
      label="Select from existing or type to add your payment method"
      value={inputValue}
      placeholder="Type or select payment method"
      autoComplete="off"
    />
  );

  return (
    <LegacyCard title="Payment Methods" sectioned>
      <div style={{ marginBottom: "15px" }}>
        <Autocomplete
          options={options}
          selected={[]}
          onSelect={(selected) => setInputValue(selected[0])}
          textField={textField}
        />
      </div>

      <Button icon={PlusIcon} onClick={addPaymentMethod}>
        Add Payment Method
      </Button>

      <div style={{ marginTop: "20px" }}>
        {selectedMethods.length > 0 ? (
          selectedMethods.map((method, index) => (
            <div key={index} className="flex items-center gap-2 mt-4">
              <div className="w-full">
                <div className="flex items-center gap-2">
                  {sort && (
                    <TextField
                      label=""
                      type="number"
                      value={orderNumbers[method] || ""}
                      onChange={(value) =>
                        handleOrderNumberChange(method, value)
                      }
                      placeholder="Enter order number"
                      autoComplete="off"
                    />
                  )}

                  <div
                    className="w-full"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "6px 10px",
                      border: "1px solid #dfe3e8",
                      borderRadius: "10px",
                    }}
                  >
                    <Text as="span">{method}</Text>
                  </div>
                </div>
                {rename && (
                  <div className="mt-2 flex items-center gap-2">
                    <Select
                      label=""
                      tone="magic"
                      options={renameOptions}
                      onChange={handleSelectChange}
                      value={selected}
                    />
                    <div className="w-full">
                      <TextField
                        label=""
                        type="text"
                        value={orderNumbers[method] || ""}
                        onChange={(value) =>
                          handleOrderNumberChange(method, value)
                        }
                        placeholder="New Payment name"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                )}
              </div>
              <Button
                icon={XIcon}
                onClick={() => removePaymentMethod(method)}
                tone="critical"
              />
            </div>
          ))
        ) : (
          <Text as="span">No payment methods added yet.</Text>
        )}
      </div>
    </LegacyCard>
  );
}

export default Payment;
