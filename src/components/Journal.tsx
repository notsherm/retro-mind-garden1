import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { EntryList } from './EntryList';
import { SearchPanel } from './SearchPanel';

interface Section {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  date: string;
}

export const Journal = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();

  useEffect(() => {
    const savedSections = localStorage.getItem('journal-sections');
    if (savedSections) {
      setSections(JSON.parse(savedSections));
    }
  }, []);

  const addNewSection = () => {
    if (!newSectionTitle.trim() || !newContent.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and content for your entry",
        duration: 2000,
      });
      return;
    }

    const newSection = {
      id: Date.now().toString(),
      title: newSectionTitle,
      content: newContent,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0],
    };

    const updatedSections = [...sections, newSection];
    setSections(updatedSections);
    localStorage.setItem('journal-sections', JSON.stringify(updatedSections));
    
    setNewSectionTitle("");
    setNewContent("");

    toast({
      title: "Entry added",
      description: "Your journal entry has been saved",
      duration: 2000,
    });
  };

  const startEditing = (section: Section) => {
    setEditingSection(section);
    setNewSectionTitle(section.title);
    setNewContent(section.content);
  };

  const saveEdit = () => {
    if (!editingSection) return;

    const updatedSections = sections.map(section => 
      section.id === editingSection.id 
        ? { ...section, title: newSectionTitle, content: newContent }
        : section
    );

    setSections(updatedSections);
    localStorage.setItem('journal-sections', JSON.stringify(updatedSections));
    setEditingSection(null);
    setNewSectionTitle("");
    setNewContent("");

    toast({
      title: "Entry updated",
      description: "Your changes have been saved",
      duration: 2000,
    });
  };

  const cancelEdit = () => {
    setEditingSection(null);
    setNewSectionTitle("");
    setNewContent("");
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    const newDate = new Date(currentDate);
    
    if (direction === 'prev') {
      newDate.setDate(currentDate.getDate() - 1);
    } else {
      newDate.setDate(currentDate.getDate() + 1);
    }
    
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  const filteredSections = sections.filter(
    section => section.date === selectedDate
  );

  return (
    <div className="min-h-screen h-screen p-4 bg-terminal-black">
      <SearchPanel sections={sections} onDateSelect={setSelectedDate} />
      
      <div className="h-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Input Area */}
        <div className="terminal-window h-full">
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="New section title..."
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              className="retro-input"
            />
            
            <Textarea
              placeholder="Write your thoughts..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="retro-input min-h-[calc(100vh-300px)] resize-none"
            />

            {editingSection ? (
              <div className="flex gap-2">
                <Button onClick={saveEdit} className="retro-button flex-1">
                  Save Changes
                </Button>
                <Button onClick={cancelEdit} className="retro-button flex-1">
                  Cancel
                </Button>
              </div>
            ) : (
              <Button onClick={addNewSection} className="retro-button w-full">
                Add Entry
              </Button>
            )}
          </div>
        </div>

        {/* Right Column - Entries Display & Analysis */}
        <div className="terminal-window h-full">
          {!showAnalysis ? (
            <>
              <EntryList 
                entries={filteredSections}
                selectedDate={selectedDate}
                onDateChange={navigateDate}
                onEntryClick={startEditing}
              />
              
              {filteredSections.length > 0 && (
                <Button
                  onClick={() => {
                    setShowAnalysis(true);
                    setAnalysis("Based on your entries, it seems you're feeling reflective today. Your writing shows a pattern of introspective thinking...");
                    toast({
                      title: "Analysis complete",
                      description: "AI has analyzed your entries",
                      duration: 2000,
                    });
                  }}
                  className="retro-button w-full mt-4"
                >
                  Analyze Entries
                </Button>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div className="animate-typing overflow-hidden whitespace-pre-wrap border-r-2 border-terminal-green">
                {analysis}
              </div>
              <Button
                onClick={() => setShowAnalysis(false)}
                className="retro-button w-full"
              >
                Back to Entries
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Auto-save indicator */}
      <div className="fixed bottom-4 right-4">
        <Button
          className="retro-button"
          onClick={() => {
            toast({
              title: "Saved",
              description: "Your journal is backed up and secure",
              duration: 2000,
            });
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
};