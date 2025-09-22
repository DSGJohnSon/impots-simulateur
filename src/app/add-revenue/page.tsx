"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";
import { PlusIcon } from "@heroicons/react/24/outline";

const ORGANISMES_OPTIONS = {
  salaire: ["Prysm Softwatre", "Regiorail"],
  auto_entrepreneur_bic: ["Auto-entrepreneur BIC"],
  auto_entrepreneur_bnc: ["Auto-entrepreneur BNC"],
  chomage: ["France Travail"],
};

const TYPE_REVENU_LABELS = {
  salaire: "Salaire",
  auto_entrepreneur_bic: "Auto-entrepreneur BIC",
  auto_entrepreneur_bnc: "Auto-entrepreneur BNC",
  chomage: "Indemnités chômage",
};

export default function AddRevenue() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    date: "",
    type_revenu: "salaire" as keyof typeof ORGANISMES_OPTIONS,
    organisme: "",
    montant: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.from("revenus").insert([
        {
          date: formData.date,
          type_revenu: formData.type_revenu,
          organisme: formData.organisme,
          montant: parseFloat(formData.montant),
        },
      ]);

      if (error) throw error;

      // Rediriger vers le dashboard après ajout
      router.push("/");
    } catch (error) {
      console.error("Erreur lors de l'ajout du revenu:", error);
      setError("Erreur lors de l'ajout du revenu. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type: keyof typeof ORGANISMES_OPTIONS) => {
    setFormData({
      ...formData,
      type_revenu: type,
      organisme: ORGANISMES_OPTIONS[type][0] || "",
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Ajouter un revenu</h1>
        <p className="mt-2 text-gray-600">
          Enregistrez un nouveau revenu pour mettre à jour vos calculs d&apos;impôts
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PlusIcon className="w-5 h-5 mr-2" />
            Nouveau revenu
          </CardTitle>
          <CardDescription>
            Remplissez les informations ci-dessous pour ajouter un revenu. Vous
            pouvez retrouver ces informations sur vos bulletins de paie, relevés
            bancaires ou attestations d&apos;organismes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                Date
              </label>
              <p className="text-xs text-gray-500 mb-1">
                Date de réception du revenu (visible sur votre relevé bancaire)
              </p>
              <input
                type="date"
                id="date"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="type_revenu"
                className="block text-sm font-medium text-gray-700"
              >
                Type de revenu
              </label>
              <p className="text-xs text-gray-500 mb-1">
                Choisissez selon la source : bulletin de paie (salaire), facture
                auto-entrepreneur, ou attestation France Travail
              </p>
              <select
                id="type_revenu"
                required
                value={formData.type_revenu}
                onChange={(e) =>
                  handleTypeChange(
                    e.target.value as keyof typeof ORGANISMES_OPTIONS
                  )
                }
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {Object.entries(TYPE_REVENU_LABELS).map(([value, label]) => (
                  <option key={value} value={value} className="text-black">
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="organisme"
                className="block text-sm font-medium text-gray-700"
              >
                Organisme
              </label>
              <p className="text-xs text-gray-500 mb-1">
                Nom de l&apos;entreprise ou organisme qui vous a versé ce revenu
              </p>
              <select
                id="organisme"
                required
                value={formData.organisme}
                onChange={(e) =>
                  setFormData({ ...formData, organisme: e.target.value })
                }
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="" className="text-black">Sélectionnez un organisme</option>
                {ORGANISMES_OPTIONS[formData.type_revenu].map((organisme) => (
                  <option key={organisme} value={organisme} className="text-black">
                    {organisme}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="montant"
                className="block text-sm font-medium text-gray-700"
              >
                Montant (€)
              </label>
              <p className="text-xs text-gray-500 mb-1">
                {formData.type_revenu === "salaire"
                  ? 'Montant net imposable (ligne "Net imposable" de votre bulletin de paie)'
                  : formData.type_revenu.includes("auto_entrepreneur")
                  ? "Montant brut facturé (avant abattement fiscal)"
                  : "Montant perçu (visible sur votre relevé bancaire)"}
              </p>
              <input
                type="number"
                id="montant"
                required
                min="0"
                step="0.01"
                value={formData.montant}
                onChange={(e) =>
                  setFormData({ ...formData, montant: e.target.value })
                }
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="0.00"
              />
            </div>
            {/* Section d'aide */}
            <Card className="mt-6 bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">
                  💡 Où trouver ces informations ?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">
                      📄 Pour les salaires :
                    </h4>
                    <ul className="text-blue-700 space-y-1 text-xs">
                      <li>
                        • <strong>Montant :</strong> Ligne &quot;Net imposable&quot; sur
                        votre bulletin de paie
                      </li>
                      <li>
                        • <strong>Date :</strong> Date de virement visible sur
                        votre relevé bancaire
                      </li>
                      <li>
                        • <strong>Organisme :</strong> Nom de votre employeur
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">
                      🏢 Pour l&apos;auto-entrepreneur :
                    </h4>
                    <ul className="text-blue-700 space-y-1 text-xs">
                      <li>
                        • <strong>Montant :</strong> Montant brut de votre
                        facture (avant abattement)
                      </li>
                      <li>
                        • <strong>Date :</strong> Date de réception du paiement
                      </li>
                      <li>
                        • <strong>Type :</strong> BIC (commerce/services) ou BNC
                        (libéral)
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">
                      🏛️ Pour le chômage :
                    </h4>
                    <ul className="text-blue-700 space-y-1 text-xs">
                      <li>
                        • <strong>Montant :</strong> Montant net versé par
                        France Travail
                      </li>
                      <li>
                        • <strong>Date :</strong> Date de virement sur votre
                        compte
                      </li>
                      <li>
                        • <strong>Justificatif :</strong> Attestation mensuelle
                        France Travail
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">
                      🎁 Pour les dons :
                    </h4>
                    <ul className="text-blue-700 space-y-1 text-xs">
                      <li>
                        • <strong>Montant :</strong> Montant indiqué sur le reçu
                        fiscal
                      </li>
                      <li>
                        • <strong>Date :</strong> Date du don (sur le reçu)
                      </li>
                      <li>
                        • <strong>Important :</strong> Conservez tous vos reçus
                        fiscaux
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? "Ajout en cours..." : "Ajouter le revenu"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Section pour ajouter un don */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Ajouter un don</CardTitle>
          <CardDescription>
            Les dons permettent de bénéficier d&apos;une réduction d&apos;impôt de 66%.
            Conservez vos reçus fiscaux pour justifier vos dons.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DonForm />
        </CardContent>
      </Card>
    </div>
  );
}

function DonForm() {
  const [donData, setDonData] = useState({
    date: "",
    organisme: "Fondation de France",
    montant: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const { error } = await supabase.from("dons").insert([
        {
          date: donData.date,
          organisme: donData.organisme,
          montant: parseFloat(donData.montant),
        },
      ]);

      if (error) throw error;

      setSuccess(true);
      setDonData({ date: "", organisme: "Fondation de France", montant: "" });
    } catch (error) {
      console.error("Erreur lors de l'ajout du don:", error);
      setError("Erreur lors de l'ajout du don. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-sm text-green-600">Don ajouté avec succès !</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="don-date"
            className="block text-sm font-medium text-gray-700"
          >
            Date
          </label>
          <p className="text-xs text-gray-500 mb-1">
            Date du don (visible sur votre reçu fiscal)
          </p>
          <input
            type="date"
            id="don-date"
            required
            value={donData.date}
            onChange={(e) => setDonData({ ...donData, date: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="don-organisme"
            className="block text-sm font-medium text-gray-700"
          >
            Organisme
          </label>
          <p className="text-xs text-gray-500 mb-1">
            Nom de l&apos;organisme bénéficiaire (indiqué sur votre reçu fiscal)
          </p>
          <input
            type="text"
            id="don-organisme"
            required
            value={donData.organisme}
            onChange={(e) =>
              setDonData({ ...donData, organisme: e.target.value })
            }
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="don-montant"
            className="block text-sm font-medium text-gray-700"
          >
            Montant (€)
          </label>
          <p className="text-xs text-gray-500 mb-1">
            Montant du don (indiqué sur votre reçu fiscal)
          </p>
          <input
            type="number"
            id="don-montant"
            required
            min="0"
            step="0.01"
            value={donData.montant}
            onChange={(e) =>
              setDonData({ ...donData, montant: e.target.value })
            }
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {loading ? "Ajout en cours..." : "Ajouter le don"}
        </button>
      </div>
    </form>
  );
}
