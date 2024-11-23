import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CompanyData {
  metrics: {
    revenue: number | null;
    funding: number | null;
    market_share: number | null;
    growth_rate: number | null;
  };
  business_model: {
    core_offering: string;
    unit_economics: string;
    channels: string[];
    partnerships: string[];
  };
  context: {
    market_size: number | null;
    key_players: string[];
    recent_developments: string[];
  };
  analysis_points: string[];
}

interface CompanyDataFormProps {
  companyData: CompanyData;
  setCompanyData: React.Dispatch<React.SetStateAction<CompanyData>>;
}

export function CompanyDataForm({
  companyData,
  setCompanyData,
}: CompanyDataFormProps) {
  const handleInputChange = (
    section: keyof CompanyData,
    field: string,
    value: string
  ) => {
    setCompanyData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]:
          value === "" ? null : isNaN(Number(value)) ? value : Number(value),
      },
    }));
  };

  const handleArrayInputChange = (
    section: keyof CompanyData,
    field: string,
    value: string
  ) => {
    setCompanyData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value.split(",").map((item) => item.trim()),
      },
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="revenue">Revenue</Label>
            <Input
              id="revenue"
              type="number"
              value={companyData.metrics.revenue || ""}
              onChange={(e) =>
                handleInputChange("metrics", "revenue", e.target.value)
              }
              placeholder="Enter revenue"
            />
          </div>
          <div>
            <Label htmlFor="funding">Funding</Label>
            <Input
              id="funding"
              type="number"
              value={companyData.metrics.funding || ""}
              onChange={(e) =>
                handleInputChange("metrics", "funding", e.target.value)
              }
              placeholder="Enter funding"
            />
          </div>
          <div>
            <Label htmlFor="market_share">Market Share (%)</Label>
            <Input
              id="market_share"
              type="number"
              value={companyData.metrics.market_share || ""}
              onChange={(e) =>
                handleInputChange("metrics", "market_share", e.target.value)
              }
              placeholder="Enter market share"
            />
          </div>
          <div>
            <Label htmlFor="growth_rate">Growth Rate (%)</Label>
            <Input
              id="growth_rate"
              type="number"
              value={companyData.metrics.growth_rate || ""}
              onChange={(e) =>
                handleInputChange("metrics", "growth_rate", e.target.value)
              }
              placeholder="Enter growth rate"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Business Model</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="core_offering">Core Offering</Label>
            <Textarea
              id="core_offering"
              value={companyData.business_model.core_offering}
              onChange={(e) =>
                handleInputChange(
                  "business_model",
                  "core_offering",
                  e.target.value
                )
              }
              placeholder="Describe the core offering"
            />
          </div>
          <div>
            <Label htmlFor="unit_economics">Unit Economics</Label>
            <Textarea
              id="unit_economics"
              value={companyData.business_model.unit_economics}
              onChange={(e) =>
                handleInputChange(
                  "business_model",
                  "unit_economics",
                  e.target.value
                )
              }
              placeholder="Describe the unit economics"
            />
          </div>
          <div>
            <Label htmlFor="channels">Channels (comma-separated)</Label>
            <Input
              id="channels"
              value={companyData.business_model.channels.join(", ")}
              onChange={(e) =>
                handleArrayInputChange(
                  "business_model",
                  "channels",
                  e.target.value
                )
              }
              placeholder="Enter channels, separated by commas"
            />
          </div>
          <div>
            <Label htmlFor="partnerships">Partnerships (comma-separated)</Label>
            <Input
              id="partnerships"
              value={companyData.business_model.partnerships.join(", ")}
              onChange={(e) =>
                handleArrayInputChange(
                  "business_model",
                  "partnerships",
                  e.target.value
                )
              }
              placeholder="Enter partnerships, separated by commas"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Context</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="market_size">Market Size</Label>
            <Input
              id="market_size"
              type="number"
              value={companyData.context.market_size || ""}
              onChange={(e) =>
                handleInputChange("context", "market_size", e.target.value)
              }
              placeholder="Enter market size"
            />
          </div>
          <div>
            <Label htmlFor="key_players">Key Players (comma-separated)</Label>
            <Input
              id="key_players"
              value={companyData.context.key_players.join(", ")}
              onChange={(e) =>
                handleArrayInputChange("context", "key_players", e.target.value)
              }
              placeholder="Enter key players, separated by commas"
            />
          </div>
          <div>
            <Label htmlFor="recent_developments">
              Recent Developments (comma-separated)
            </Label>
            <Textarea
              id="recent_developments"
              value={companyData.context.recent_developments.join(", ")}
              onChange={(e) =>
                handleArrayInputChange(
                  "context",
                  "recent_developments",
                  e.target.value
                )
              }
              placeholder="Enter recent developments, separated by commas"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Analysis Points</h3>
        <div>
          <Label htmlFor="analysis_points">
            Analysis Points (comma-separated)
          </Label>
          <Textarea
            id="analysis_points"
            value={companyData.analysis_points.join(", ")}
            onChange={(e) =>
              handleArrayInputChange(
                "analysis_points",
                "analysis_points",
                e.target.value
              )
            }
            placeholder="Enter analysis points, separated by commas"
          />
        </div>
      </div>
    </div>
  );
}
