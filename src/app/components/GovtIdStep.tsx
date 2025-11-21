import { useState, useRef } from "react";
import {
  ChevronDown,
  Upload,
  Trash2,
  FileText,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useOnboardingStore } from "../../store/onboardingStore";

interface UploadedId {
  id: string;
  file: File;
  idType: string;
}

interface GovtIdStepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function GovtIdStep({ onNext, onBack }: GovtIdStepProps) {
  const { govtIds, addGovtId, removeGovtId, updateGovtIdType } = useOnboardingStore();
  const [currentIdType, setCurrentIdType] = useState("Aadhar Card");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [editingDropdown, setEditingDropdown] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert store govtIds to local format for display
  const uploadedIds: UploadedId[] = govtIds.map((id) => ({
    id: id.id,
    file: id.file || new File([], id.fileName, { type: id.fileType }),
    idType: id.idType,
  }));

  const idTypes = ["Aadhar Card", "PAN Card", "Voter ID", "Driving License"];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      // Add to store
      await addGovtId(file, currentIdType);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      // Add to store
      await addGovtId(file, currentIdType);
    }
  };

  const removeFile = (idToRemove: string) => {
    removeGovtId(idToRemove);
  };

  const updateIdType = (idToUpdate: string, newType: string) => {
    updateGovtIdType(idToUpdate, newType);
    setEditingDropdown(null);
  };

  return (
    <div className="w-full mx-auto max-w-4xl max-h-[70vh] my-auto flex flex-col h-full">
      <div className="mb-6">
        <p className="text-sm text-gray-500">Step 2 of 5</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Add <span className="text-[#0F62FE]">Govt. ID Proof</span>
        </h1>
        <p className="mt-4 text-gray-600">
          Upload valid Government-issued IDs (JPG, PNG, PDF – max 10MB each).
          These will be used only for verification.
        </p>
      </div>

      {/* ID Type Dropdown for new uploads */}
      <div className="relative mb-8 w-full">
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex w-full items-center justify-between border-b border-gray-300 py-2 text-left outline-none focus:border-[#0F62FE]"
        >
          <span className="text-[#0F62FE]">{currentIdType}</span>
          <ChevronDown
            size={20}
            className={`text-gray-400 transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1">
            {idTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setCurrentIdType(type);
                  setIsDropdownOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-blue-50 text-gray-900 transition-colors"
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Upload Area */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-[#0F62FE]/30 rounded-lg p-12 text-center hover:bg-blue-50/50 transition-colors mb-6 w-full"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".jpg,.jpeg,.png,.pdf"
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center gap-4">
          <Upload size={32} className="text-gray-600" />
          <div className="text-gray-900 font-medium">
            Drag & Drop your ID here
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-[#0F62FE] font-semibold hover:underline"
          >
            Browse Files
          </button>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedIds.length > 0 && (
        <div className="mb-6 w-full space-y-3 max-h-[30vh] overflow-y-auto">
          {uploadedIds.map((uploadedId) => (
            <div
              key={uploadedId.id}
              className="bg-blue-100/50 rounded-lg p-4 border border-blue-100"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 flex-1">
                  <div className="bg-red-500 p-2 rounded text-white flex-shrink-0">
                    <FileText size={20} />
                  </div>
                  <span className="text-[#0F62FE] font-medium truncate">
                    {uploadedId.file.name}
                  </span>
                </div>
                <button
                  onClick={() => removeFile(uploadedId.id)}
                  className="bg-[#0F62FE] p-2 rounded-full text-white hover:bg-blue-700 transition-colors flex-shrink-0 ml-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* ID Type Dropdown for each uploaded file */}
              <div className="relative ml-11">
                <button
                  type="button"
                  onClick={() =>
                    setEditingDropdown(
                      editingDropdown === uploadedId.id ? null : uploadedId.id
                    )
                  }
                  className="flex w-full items-center justify-between border-b border-gray-300 py-1 text-left text-sm outline-none focus:border-[#0F62FE]"
                >
                  <span className="text-gray-700">{uploadedId.idType}</span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform ${
                      editingDropdown === uploadedId.id ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {editingDropdown === uploadedId.id && (
                  <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1">
                    {idTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => updateIdType(uploadedId.id, type)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 text-gray-900 transition-colors"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-gray-400 italic mb-8">
        Your IDs are stored securely and used only for volunteer verification.
      </p>

      {/* Navigation Buttons */}
      <div className="mt-auto flex justify-between items-center max-w-4xl w-full pt-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 font-semibold text-gray-900 hover:text-[#0F62FE] transition-colors"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <button
          onClick={onNext}
          className="flex items-center gap-2 font-semibold text-[#0F62FE] hover:underline"
        >
          Next <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
