import { AIInsight } from './types.ts';

export function parseInsightsResponse(analysisResult: string): AIInsight[] {
  console.log('AI Analysis Result:', analysisResult);

  let insights: AIInsight[];
  try {
    const parsedResult = JSON.parse(analysisResult);
    insights = parsedResult.insights || [];
    
    // Ensure each insight has required properties
    insights = insights.map((insight: any) => ({
      id: insight.id || `ai_${Date.now()}_${Math.random()}`,
      title: insight.title || 'AI Insight',
      description: insight.description || 'Analysis completed',
      priority: insight.priority || 'medium',
      channel: insight.channel || 'cross-channel',
      impact: insight.impact || 'Analysis impact available',
      action: insight.action || 'Review recommendation',
      recommendations: insight.recommendations || {}
    }));
  } catch (parseError) {
    console.error('Error parsing AI response:', parseError);
    // Fallback to basic insights if parsing fails
    insights = [
      {
        id: `fallback_${Date.now()}`,
        title: "Analysis Generated",
        description: "AI analysis completed for your marketing data. Review individual channels for detailed insights.",
        priority: "medium",
        channel: "cross-channel",
        impact: "Comprehensive data analysis available",
        action: "Review detailed metrics in each channel dashboard",
        recommendations: {}
      }
    ];
  }

  return insights;
}