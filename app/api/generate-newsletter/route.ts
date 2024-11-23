import { NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import axios from "axios";
import { remark } from "remark";
import html from "remark-html";

interface Metric {
  value: number | null;
  source: string | null;
}

interface StoryTemplate {
  headline: string | null;
  context: {
    market_size: Metric;
    key_players: string[];
    recent_developments: string[];
  };
  metrics: {
    revenue: Metric;
    funding: Metric;
    market_share: Metric;
    growth_rate: Metric;
  };
  business_model: {
    core_offering: string | null;
    unit_economics: string | null;
    channels: string[];
    partnerships: string[];
  };
  analysis_points: string[];
}

class NewsletterResearchBot {
  private story_template: StoryTemplate;

  constructor() {
    this.story_template = {
      headline: null,
      context: {
        market_size: { value: null, source: null },
        key_players: [],
        recent_developments: [],
      },
      metrics: {
        revenue: { value: null, source: null },
        funding: { value: null, source: null },
        market_share: { value: null, source: null },
        growth_rate: { value: null, source: null },
      },
      business_model: {
        core_offering: null,
        unit_economics: null,
        channels: [],
        partnerships: [],
      },
      analysis_points: [],
    };
  }

  async research_company(
    company_name: string,
    company_data: {
      metrics: { [key: string]: Metric };
      business_model: { [key: string]: string | number | string[] | null };
      context: {
        market_size: Metric;
        key_players: string[];
        recent_developments: string[];
      };
      analysis_points: string[];
    }
  ) {
    const story = { ...this.story_template };
    story.headline = await this.generate_hook(company_name);
    story.metrics = {
      revenue: { value: null, source: "Unknown" },
      funding: { value: null, source: "Unknown" },
      market_share: { value: null, source: "Unknown" },
      growth_rate: { value: null, source: "Unknown" },
      ...this.processMetrics(company_data.metrics),
    };
    story.business_model = {
      ...story.business_model,
      ...company_data.business_model,
    };
    story.context = {
      ...story.context,
      ...this.processContext(company_data.context),
    };
    story.analysis_points = company_data.analysis_points || [];
    return story;
  }

  processMetrics(metrics: { [key: string]: Metric }) {
    const processedMetrics: { [key: string]: Metric } = {};
    for (const [key, value] of Object.entries(metrics)) {
      if (typeof value === "object" && value !== null) {
        processedMetrics[key] = {
          value: (value as Metric).value,
          source: (value as Metric).source || "Unknown",
        };
      } else {
        processedMetrics[key] = {
          value: value as number | null,
          source: "Unknown",
        };
      }
    }
    return processedMetrics;
  }

  processContext(context: {
    market_size: Metric;
    key_players: string[];
    recent_developments: string[];
  }) {
    const processedContext = { ...context };
    if (
      typeof context.market_size === "object" &&
      context.market_size !== null
    ) {
      processedContext.market_size = {
        value: context.market_size.value,
        source: context.market_size.source || "Unknown",
      };
    } else {
      processedContext.market_size = {
        value: context.market_size,
        source: "Unknown",
      };
    }
    return processedContext;
  }

  async generate_hook(company_name: string) {
    const prompt = `Create an engaging headline for a newsletter about ${company_name}, highlighting its innovative business model and recent growth. Include a sense of excitement.`;
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      messages: [{ role: "user", content: prompt }],
      maxTokens: 50,
      temperature: 0.8,
    });
    return text.trim();
  }

  async format_story(story_data: StoryTemplate) {
    const prompt = `Write a compelling newsletter research document about the company based on the following details:

Headline: ${story_data.headline}
Context: ${JSON.stringify(story_data.context)}
Metrics: ${JSON.stringify(story_data.metrics)}
Business Model: ${JSON.stringify(story_data.business_model)}
Analysis Points: ${JSON.stringify(story_data.analysis_points)}

Structure the story into sections like Context, Business Model, Metrics, and Insights. For any numerical data, include the source of the information in parentheses after the number.`;

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      messages: [{ role: "user", content: prompt }],
      maxTokens: 10000,
      temperature: 0.7,
    });
    console.log("OpenAI Formatted Story:", text);
    return text.trim();
  }

  format_metrics(metric: Metric, metric_type: string) {
    let formattedValue = "";
    if (metric.value !== null) {
      if (metric_type === "inr") {
        if (metric.value >= 10000000) {
          formattedValue = `₹${(metric.value / 10000000).toFixed(0)} crores`;
        } else {
          formattedValue = `₹${metric.value.toLocaleString("en-IN")}`;
        }
      } else if (metric_type === "usd") {
        if (metric.value >= 1000000) {
          formattedValue = `$${(metric.value / 1000000).toFixed(0)}M`;
        } else {
          formattedValue = `$${metric.value.toLocaleString("en-US")}`;
        }
      } else {
        formattedValue = metric.value.toString();
      }
    }
    return `${formattedValue} (Source: ${metric.source})`;
  }
}

async function researchCompanyWithPerplexity(company_name: string) {
  const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
  if (!PERPLEXITY_API_KEY) {
    throw new Error("Perplexity API key is not set");
  }

  const response = await axios.post(
    "https://api.perplexity.ai/chat/completions",
    {
      model: "llama-3.1-sonar-small-128k-online",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that provides accurate information about companies.",
        },
        {
          role: "user",
          content: `Research the company ${company_name} and provide information about its business model, metrics (if available), market context, and key analysis points. Format the response strictly as a JSON object with keys: business_model, metrics, context, and analysis_points. Do not include any explanations, code fences, or additional formatting. Provide only the JSON object.`,
          /*
                    content: `Research the company ${company_name} and provide information about its business model, metrics (if available), market context, and key analysis points. Format the response as a JSON object with keys: business_model, metrics, context, and analysis_points.`

          */
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  console.log("----------Perplexity RAW Response:", response.data);

  let assistantMessage = response.data.choices[0].message.content;

  assistantMessage = assistantMessage
    .replace(/(^```(?:json)?\s*|```$)/g, "")
    .trim();

  let researchData = null;
  try {
    researchData = JSON.parse(assistantMessage);
  } catch (error) {
    console.error("Error parsing JSON response from Perplexity:", error);
    throw new Error("Failed to parse JSON response from Perplexity");
  }
  return { data: researchData, citations: response.data.citations || [] };
}

async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export async function POST(req: Request) {
  try {
    const { company_name, company_data } = await req.json();
    const bot = new NewsletterResearchBot();

    let research_data = company_data;
    let rawApiResponse = null;
    let citations: string[] = [];

    if (!company_data) {
      try {
        const perplexityResponse = await researchCompanyWithPerplexity(
          company_name
        );
        research_data = perplexityResponse.data;
        citations = perplexityResponse.citations;
      } catch (error) {
        console.error("Error fetching data from Perplexity:", error);
        if (error instanceof Error) {
          rawApiResponse = error.message;
        } else {
          rawApiResponse = "An unknown error occurred";
        }
      }
    }

    if (!research_data && !rawApiResponse) {
      throw new Error("Failed to fetch company data");
    }

    let formatted_story = "";
    if (research_data) {
      const story = await bot.research_company(company_name, research_data);
      formatted_story = await bot.format_story(story);
    }

    // Check if the formatted_story is in markdown format
    const isMarkdown =
      formatted_story.includes("##") || formatted_story.includes("*");

    let htmlContent = "";
    if (isMarkdown) {
      htmlContent = await markdownToHtml(formatted_story);
    }

    return NextResponse.json({
      story: formatted_story,
      htmlContent,
      isMarkdown,
      rawApiResponse,
      citations,
    });
  } catch (error) {
    console.error("Error generating newsletter:", error);
    return NextResponse.json(
      { error: "Failed to generate newsletter" },
      { status: 500 }
    );
  }
}
