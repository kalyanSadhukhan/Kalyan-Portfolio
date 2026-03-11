import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export default function AboutEditor() {

    const [aboutId, setAboutId] = useState<number | null>(null);

    const [form, setForm] = useState({
        profileImageUrl: "",
        bioParagraph1: "",
        bioParagraph2: "",
        bioParagraph3: ""
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);



    useEffect(() => {
        fetchAbout();
    }, []);



    const fetchAbout = async () => {

        try {

            const data = await api.get("/api/about");

            if (Array.isArray(data) && data.length > 0) {
                const about = data[0];
                setAboutId(about.id);
                setForm({
                    profileImageUrl: about.profileImageUrl || "",
                    bioParagraph1: about.bioParagraph1 || "",
                    bioParagraph2: about.bioParagraph2 || "",
                    bioParagraph3: about.bioParagraph3 || ""
                });
            } else if (data && typeof data === 'object' && !Array.isArray(data)) {
                const about = data;
                setAboutId(about.id);
                setForm({
                    profileImageUrl: about.profileImageUrl || "",
                    bioParagraph1: about.bioParagraph1 || "",
                    bioParagraph2: about.bioParagraph2 || "",
                    bioParagraph3: about.bioParagraph3 || ""
                });
            }

        } catch (error) {

            console.error("Failed to fetch about", error);

        } finally {

            setIsLoading(false);

        }

    };



    const handleChange = (field: string, value: string) => {

        setForm(prev => ({
            ...prev,
            [field]: value
        }));

    };



    const handleSave = async () => {

        setIsSaving(true);

        try {

            if (aboutId) {

                await api.put(`/api/about/${aboutId}`, form);

            } else {

                const created = await api.post("/api/about", form);
                setAboutId(created.id);

            }

            alert("About section saved successfully");

        } catch (error) {

            console.error("Save failed", error);
            alert("Failed to save about section");

        } finally {

            setIsSaving(false);

        }

    };



    if (isLoading) {

        return (
            <div className="flex justify-center py-8">
                <Loader2 className="animate-spin" />
            </div>
        );

    }



    return (

        <div className="space-y-4">

            <input
                type="text"
                placeholder="Profile Image URL"
                value={form.profileImageUrl}
                onChange={(e) => handleChange("profileImageUrl", e.target.value)}
                className="w-full border p-2 rounded"
            />

            <Textarea
                placeholder="Paragraph 1"
                value={form.bioParagraph1}
                onChange={(e) => handleChange("bioParagraph1", e.target.value)}
            />

            <Textarea
                placeholder="Paragraph 2"
                value={form.bioParagraph2}
                onChange={(e) => handleChange("bioParagraph2", e.target.value)}
            />

            <Textarea
                placeholder="Paragraph 3"
                value={form.bioParagraph3}
                onChange={(e) => handleChange("bioParagraph3", e.target.value)}
            />

            <div className="flex justify-end">

                <Button onClick={handleSave} disabled={isSaving}>

                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Save About"
                    )}

                </Button>

            </div>

        </div>

    );

}