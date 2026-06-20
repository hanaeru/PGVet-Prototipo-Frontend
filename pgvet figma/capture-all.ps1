$captures = @(
  @{ name = "Login"; view = "login"; id = "f60f1818-c3e0-44a9-a390-cc5d8736c02f" },
  @{ name = "Dashboard"; view = "dashboard"; id = "659f1d7d-871e-47ec-a31d-9d2557da976a" },
  @{ name = "Patients"; view = "patients"; id = "37d4dbbf-91ff-43a6-bd47-56b7103e365d" },
  @{ name = "Appointments"; view = "appointments"; id = "26fbb658-2db9-44cd-86d4-f51a93177481" },
  @{ name = "Clinical Record"; view = "clinical-records"; id = "49043206-82b3-49e1-9a7e-bafec32c87b5" },
  @{ name = "Vaccines"; view = "vaccines"; id = "b9cb85f1-677e-4676-8e51-cce043b1a76b" },
  @{ name = "Recipes"; view = "recipes"; id = "7e8fd67f-50c8-48f4-a0f0-3df2575c8153" },
  @{ name = "Inventory"; view = "inventory"; id = "69658e37-4854-4084-bc0b-8c33040e2716" },
  @{ name = "Staff"; view = "staff"; id = "9e8b43eb-a0e2-4922-b7ed-26adb5f878c3" },
  @{ name = "Payments"; view = "payments"; id = "10b4556f-5a47-44e1-9eca-21c6885ccb20" },
  @{ name = "Notifications"; view = "notifications"; id = "9868149e-d1bd-4d2b-bfb8-4a983837db43" }
)

foreach ($c in $captures) {
  $enc = [uri]::EscapeDataString("https://mcp.figma.com/mcp/capture/$($c.id)/submit")
  $url = "http://localhost:3456/?view=$($c.view)&capture=1#figmacapture=$($c.id)&figmaendpoint=$enc&figmadelay=3000"
  Write-Host "Opening $($c.name)..."
  Start-Process $url
  Start-Sleep -Seconds 12
}

Write-Host "All capture URLs opened."
