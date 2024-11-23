"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader } from "@/components/loader";
import { CompanyDataForm } from "@/components/company-data-form";

export default function Home() {
  const [companyName, setCompanyName] = useState("");
  const [newsletter, setNewsletter] = useState("");
  const [loading, setLoading] = useState(false);
  const [provideData, setProvideData] = useState(false);
  const [companyData, setCompanyData] = useState({
    metrics: {
      revenue: null,
      funding: null,
      market_share: null,
      growth_rate: null,
    },
    business_model: {
      core_offering: "",
      unit_economics: "",
      channels: [],
      partnerships: [],
    },
    context: {
      market_size: null,
      key_players: [],
      recent_developments: [],
    },
    analysis_points: [],
  });
  const [htmlContent, setHtmlContent] = useState("");
  const [isMarkdown, setIsMarkdown] = useState(false);
  const [rawApiResponse, setRawApiResponse] = useState("");
  const [citations, setCitations] = useState<string[]>([]);

  const generateNewsletter = async () => {
    if (!companyName) {
      alert("Please enter a company name");
      return;
    }

    setLoading(true);
    setNewsletter("");
    setHtmlContent("");
    setRawApiResponse("");
    setCitations([]);

    try {
      const response = await fetch("/api/generate-newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_name: companyName,
          company_data: provideData ? companyData : null,
        }),
      });
      const data = await response.json();
      setNewsletter(data.story);
      setHtmlContent(data.htmlContent);
      setIsMarkdown(data.isMarkdown);
      setRawApiResponse(data.rawApiResponse);
      setCitations(data.citations || []);
    } catch (error) {
      console.error("Error generating newsletter:", error);
      alert("Failed to generate newsletter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Newsletter Research Bot</h1>
      <div className="space-y-4">
        <div>
          <Label htmlFor="company-name">Company Name</Label>
          <Input
            id="company-name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter company name"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="provide-data"
            checked={provideData}
            onCheckedChange={setProvideData}
          />
          <Label htmlFor="provide-data">Provide company data</Label>
        </div>
        {provideData && (
          <CompanyDataForm
            companyData={companyData}
            setCompanyData={setCompanyData}
          />
        )}
        <Button onClick={generateNewsletter} disabled={loading}>
          {loading ? "Generating..." : "Generate Newsletter"}
        </Button>
      </div>
      {loading && (
        <div className="mt-8">
          <Loader />
        </div>
      )}
      {newsletter && !loading && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Generated Newsletter</h2>
          {isMarkdown ? (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          ) : (
            <Textarea value={newsletter} readOnly rows={20} />
          )}
        </div>
      )}
      {rawApiResponse && !loading && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Raw API Response</h2>
          <Textarea value={rawApiResponse} readOnly rows={10} />
        </div>
      )}
      {citations.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Citations</h2>
          <ul className="list-disc pl-5">
            {citations.map((citation, index) => (
              <li key={index}>
                <a
                  href={citation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {citation}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
