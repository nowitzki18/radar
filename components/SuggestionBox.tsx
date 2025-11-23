interface SuggestionBoxProps {
  suggestions: string[];
}

export default function SuggestionBox({ suggestions }: SuggestionBoxProps) {
  if (suggestions.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">AI Suggestions</h3>
        <p className="text-sm text-gray-600">No suggestions at this time.</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
        <span className="text-lg">🤖</span>
        AI Suggestions
      </h3>
      <ul className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

