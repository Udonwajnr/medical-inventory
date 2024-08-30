import ContainerLayout from "@/app/components/ContainerLayout"
export default function ProductDetails() {
    return (
      <ContainerLayout>
        <div className="max-w-4xl mx-auto px-4 py-8 md:px-6 md:py-12">
          <div className="grid gap-6 md:gap-8">
            <div>
              <h1 className="text-2xl font-bold">Amoxicillin</h1>
              <p className="text-muted-foreground">Generic Name: Amoxicillin Trihydrate</p>
            </div>
            <div className="grid gap-4">
              <div>
                <h2 className="text-lg font-semibold">Dosage Information</h2>
                <p>
                  Take 500mg every 8 hours or 875mg every 12 hours, depending on the severity of the infection. Swallow
                  whole, do not crush or chew.
                </p>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Description</h2>
                <p>
                  Amoxicillin is a penicillin-based antibiotic used to treat a variety of bacterial infections, including
                  respiratory tract infections, skin and soft tissue infections, and urinary tract infections.
                </p>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Common Side Effects</h2>
                <ul className="grid gap-2">
                  <li>Nausea</li>
                  <li>Diarrhea</li>
                  <li>Rash</li>
                  <li>Headache</li>
                  <li>Stomach pain</li>
                </ul>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Precautions and Warnings</h2>
                <ul className="grid gap-2">
                  <li>
                    Do not take if you have a history of allergic reactions to penicillin or cephalosporin antibiotics.
                  </li>
                  <li>Use with caution in patients with kidney disease, as the dosage may need to be adjusted.</li>
                  <li>
                    May interact with certain medications, including birth control pills, blood thinners, and some seizure
                    medications.
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Storage Instructions</h2>
                <p>Store at room temperature, away from moisture and heat. Keep out of reach of children.</p>
              </div>
            </div>
          </div>
        </div>
      </ContainerLayout>
    )
  }